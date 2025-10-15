-- Create trigger to automatically create profile, company, and user role when a new user signs up
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
DECLARE
  new_company_id uuid;
BEGIN
  -- Create company if company name is provided in metadata
  IF NEW.raw_user_meta_data->>'company_name' IS NOT NULL THEN
    INSERT INTO public.companies (name, contact_email, contact_phone, address, city, state, gst)
    VALUES (
      NEW.raw_user_meta_data->>'company_name',
      NEW.email,
      NEW.raw_user_meta_data->>'phone',
      NEW.raw_user_meta_data->>'address',
      NEW.raw_user_meta_data->>'city',
      NEW.raw_user_meta_data->>'state',
      NEW.raw_user_meta_data->>'gst'
    )
    RETURNING id INTO new_company_id;
  END IF;

  -- Create profile
  INSERT INTO public.profiles (id, name, phone, company_id)
  VALUES (
    NEW.id,
    COALESCE(NEW.raw_user_meta_data->>'name', NEW.email),
    NEW.raw_user_meta_data->>'phone',
    new_company_id
  );

  -- Assign default 'user' role
  INSERT INTO public.user_roles (user_id, role)
  VALUES (NEW.id, 'user');

  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Create trigger on auth.users
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW
  EXECUTE FUNCTION public.handle_new_user();