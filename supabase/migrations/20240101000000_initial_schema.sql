-- Assuming this is your initial schema migration file or a relevant one for the profiles table.
-- If your table is defined elsewhere, adjust accordingly.

-- Drop the existing handle_new_user function and trigger if you need to recreate them with changes.
-- It's often better to modify the table schema for defaults if possible.

-- Example of how you might alter the table to add DEFAULT now() if it's missing
-- You should verify column existence and types before running ALTER commands.

-- ALTER TABLE public.profiles
--   ALTER COLUMN created_at SET DEFAULT now(),
--   ALTER COLUMN updated_at SET DEFAULT now();

-- Make sure created_at and updated_at are also NOT NULL
-- ALTER TABLE public.profiles
--   ALTER COLUMN created_at SET NOT NULL,
--   ALTER COLUMN updated_at SET NOT NULL;

-- Then, ensure your handle_new_user function is robust.
-- If created_at and updated_at have defaults in the table,
-- the function can remain simple:
-- CREATE OR REPLACE FUNCTION public.handle_new_user()
-- RETURNS TRIGGER
-- LANGUAGE plpgsql
-- SECURITY DEFINER SET SEARCH_PATH = public
-- AS $$
-- BEGIN
--   INSERT INTO public.profiles (id, email)
--   VALUES (NEW.id, NEW.email);
--   RETURN NEW;
-- END;
-- $$;

-- If you prefer to set them explicitly in the function (if table defaults are not set):
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER SET SEARCH_PATH = public
AS $$
BEGIN
  INSERT INTO public.profiles (
    id,
    email,
    created_at,
    updated_at
    -- Potentially 'username' if it's NOT NULL and has no default.
    -- If username is nullable or has a default, no need to include it here
    -- unless you want to set a specific initial value like new.email.
  )
  VALUES (
    NEW.id,
    NEW.email,
    NOW(),  -- Explicitly set created_at
    NOW()   -- Explicitly set updated_at
    -- example: COALESCE(NEW.raw_user_meta_data->>'username', SPLIT_PART(NEW.email, '@', 1))
  );
  RETURN NEW;
END;
$$;

-- Ensure the trigger is correctly defined (it already exists, so this is for reference)
-- CREATE TRIGGER on_auth_user_created
--   AFTER INSERT ON auth.users
--   FOR EACH ROW EXECUTE PROCEDURE public.handle_new_user();

-- For the updated_at trigger, ensure it's on the profiles table
CREATE OR REPLACE FUNCTION public.handle_updated_at()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER SET SEARCH_PATH = public
AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$;

DROP TRIGGER IF EXISTS on_profiles_updated ON public.profiles; -- Drop if exists to avoid error
CREATE TRIGGER on_profiles_updated
  BEFORE UPDATE ON public.profiles
  FOR EACH ROW EXECUTE PROCEDURE public.handle_updated_at();

-- It's crucial that the 'profiles' table schema itself
-- defines created_at and updated_at as NOT NULL and ideally with DEFAULT now()
-- if you want the simpler handle_new_user function.
-- The version of handle_new_user above explicitly sets them,
-- which works even if the table columns don't have DEFAULT now(),
-- but they still need to allow NULL or be NOT NULL and be explicitly set.

-- The MOST LIKELY FIX is to ensure your table schema has:
-- created_at TIMESTAMPTZ NOT NULL DEFAULT now()
-- updated_at TIMESTAMPTZ NOT NULL DEFAULT now()

-- If so, your original simple handle_new_user is fine:
-- begin
--   insert into public.profiles (id, email)
--   values (new.id, new.email);
--   return new;
-- end;

-- Given the persistence of the error, the function that explicitly sets timestamps is safer for now. 