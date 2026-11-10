create table public.recipes (
  id uuid default gen_random_uuid() primary key,
  user_id uuid default auth.uid() not null references auth.users(id) on delete cascade,
  title text not null check (char_length(title) > 0),
  category text not null,
  ingredients text[] not null check (cardinality(ingredients) > 0),
  instructions text not null check (char_length(instructions) > 0),
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

alter table public.recipes enable row level security;

create policy "Users can view own recipes" on public.recipes for select using (auth.uid() = user_id);
create policy "Users can insert own recipes" on public.recipes for insert with check (auth.uid() = user_id);
create policy "Users can update own recipes" on public.recipes for update using (auth.uid() = user_id) with check (auth.uid() = user_id);
create policy "Users can delete own recipes" on public.recipes for delete using (auth.uid() = user_id);