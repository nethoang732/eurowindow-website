-- Customer lead storage for Eurowindow website forms.
-- Only the server-side service role can call the write function. No public policies are created.

create extension if not exists pgcrypto with schema extensions;

create table if not exists public.customer_leads (
  id uuid primary key default gen_random_uuid(),
  customer_code text not null unique,
  full_name text not null,
  phone text not null,
  email text,
  project_address text,
  product_interest text,
  interest text,
  project_type text,
  installation_location text,
  request_content text,
  form_source text not null,
  submitted_at timestamptz not null default now(),
  status text not null default 'new'
    check (status in ('new', 'contacted', 'consulting', 'quoted', 'won', 'closed')),
  notification_status text not null default 'pending'
    check (notification_status in ('pending', 'sent', 'failed', 'unconfigured')),
  notification_attempted_at timestamptz,
  notification_error_code text,
  idempotency_key text not null unique,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists customer_leads_submitted_at_idx
  on public.customer_leads (submitted_at desc);
create index if not exists customer_leads_status_submitted_at_idx
  on public.customer_leads (status, submitted_at desc);
create index if not exists customer_leads_phone_idx
  on public.customer_leads (phone);
create index if not exists customer_leads_email_idx
  on public.customer_leads (email) where email is not null;
create index if not exists customer_leads_product_interest_idx
  on public.customer_leads (product_interest);

create or replace function public.touch_customer_lead_updated_at()
returns trigger
language plpgsql
set search_path = ''
as $$
begin
  new.updated_at := clock_timestamp();
  return new;
end;
$$;
do $$
begin
  if not exists (
    select 1
    from pg_catalog.pg_trigger
    where tgname = 'customer_leads_touch_updated_at'
      and tgrelid = 'public.customer_leads'::regclass
      and not tgisinternal
  ) then
    create trigger customer_leads_touch_updated_at
    before update on public.customer_leads
    for each row execute function public.touch_customer_lead_updated_at();
  end if;
end;
$$;
revoke all on function public.touch_customer_lead_updated_at() from public, anon, authenticated;

alter table public.customer_leads enable row level security;
alter table public.customer_leads force row level security;
revoke all on public.customer_leads from public, anon, authenticated;
grant select (id) on public.customer_leads to service_role;
grant update (notification_status, notification_attempted_at, notification_error_code)
  on public.customer_leads to service_role;

create table if not exists public.contact_submission_limits (
  ip_hash text primary key,
  window_started_at timestamptz not null,
  request_count integer not null check (request_count >= 0)
);
alter table public.contact_submission_limits enable row level security;
alter table public.contact_submission_limits force row level security;
revoke all on public.contact_submission_limits from public, anon, authenticated;

create or replace function public.create_customer_lead(
  p_payload jsonb,
  p_ip_hash text,
  p_idempotency_key text,
  p_rate_window_seconds integer default 600,
  p_max_requests integer default 5
)
returns jsonb
language plpgsql
security definer
set search_path = ''
as $$
declare
  v_existing public.customer_leads%rowtype;
  v_id uuid;
  v_customer_code text;
  v_request_count integer;
  v_now timestamptz := clock_timestamp();
begin
  if p_payload is null
    or jsonb_typeof(p_payload) <> 'object'
    or length(coalesce(p_payload ->> 'name', '')) < 2
    or length(regexp_replace(coalesce(p_payload ->> 'phone', ''), '[^0-9]', '', 'g')) not between 9 and 15
    or p_ip_hash is null
    or p_ip_hash !~ '^[a-f0-9]{64}$'
    or p_idempotency_key is null
    or p_idempotency_key !~ '^[a-f0-9]{64}$'
    or p_rate_window_seconds not between 1 and 86400
    or p_max_requests not between 1 and 100 then
    return jsonb_build_object('success', false, 'code', 'INVALID_PAYLOAD');
  end if;

  select * into v_existing
  from public.customer_leads
  where idempotency_key = p_idempotency_key;
  if found then
    return jsonb_build_object(
      'success', true,
      'duplicate', true,
      'id', v_existing.id,
      'customer_code', v_existing.customer_code,
      'notification_status', v_existing.notification_status
    );
  end if;

  delete from public.contact_submission_limits
  where window_started_at < v_now - interval '1 day';

  insert into public.contact_submission_limits as current_limit (ip_hash, window_started_at, request_count)
  values (p_ip_hash, v_now, 1)
  on conflict (ip_hash) do update set
    window_started_at = case
      when current_limit.window_started_at <= v_now - make_interval(secs => p_rate_window_seconds)
        then v_now
      else current_limit.window_started_at
    end,
    request_count = case
      when current_limit.window_started_at <= v_now - make_interval(secs => p_rate_window_seconds)
        then 1
      else current_limit.request_count + 1
    end
  returning request_count into v_request_count;

  if v_request_count > p_max_requests then
    return jsonb_build_object('success', false, 'code', 'RATE_LIMITED');
  end if;

  v_id := gen_random_uuid();
  v_customer_code := 'EW-'
    || to_char(v_now at time zone 'Asia/Ho_Chi_Minh', 'YYYYMMDD')
    || '-'
    || upper(substr(replace(v_id::text, '-', ''), 1, 8));

  insert into public.customer_leads (
    id,
    customer_code,
    full_name,
    phone,
    email,
    project_address,
    product_interest,
    interest,
    project_type,
    installation_location,
    request_content,
    form_source,
    submitted_at,
    status,
    notification_status,
    idempotency_key
  ) values (
    v_id,
    v_customer_code,
    left(trim(p_payload ->> 'name'), 120),
    left(trim(p_payload ->> 'phone'), 32),
    nullif(left(lower(trim(coalesce(p_payload ->> 'email', ''))), 254), ''),
    nullif(left(trim(coalesce(p_payload ->> 'projectAddress', '')), 300), ''),
    nullif(left(trim(coalesce(p_payload ->> 'productInterest', '')), 200), ''),
    nullif(left(trim(coalesce(p_payload ->> 'interest', '')), 200), ''),
    nullif(left(trim(coalesce(p_payload ->> 'project', '')), 200), ''),
    nullif(left(trim(coalesce(p_payload ->> 'installationLocation', '')), 200), ''),
    nullif(left(trim(coalesce(p_payload ->> 'message', '')), 4000), ''),
    left(trim(coalesce(p_payload ->> 'pageUrl', '')), 2048),
    v_now,
    'new',
    'pending',
    p_idempotency_key
  ) on conflict (idempotency_key) do nothing;

  if not found then
    select * into v_existing
    from public.customer_leads
    where idempotency_key = p_idempotency_key;
    return jsonb_build_object(
      'success', true,
      'duplicate', true,
      'id', v_existing.id,
      'customer_code', v_existing.customer_code,
      'notification_status', v_existing.notification_status
    );
  end if;

  return jsonb_build_object(
    'success', true,
    'duplicate', false,
    'id', v_id,
    'customer_code', v_customer_code,
    'notification_status', 'pending'
  );
end;
$$;

revoke all on function public.create_customer_lead(jsonb, text, text, integer, integer) from public, anon, authenticated;
grant execute on function public.create_customer_lead(jsonb, text, text, integer, integer) to service_role;
