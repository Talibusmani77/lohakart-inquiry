-- Fix security warnings by setting search_path on all functions

-- Update update_updated_at_column function
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER SET search_path = public;

-- Update generate_inquiry_number function
CREATE OR REPLACE FUNCTION public.generate_inquiry_number()
RETURNS text AS $$
DECLARE
  year TEXT;
  count INTEGER;
  new_number TEXT;
BEGIN
  year := EXTRACT(YEAR FROM now())::TEXT;
  SELECT COUNT(*) + 1 INTO count FROM public.inquiries
  WHERE EXTRACT(YEAR FROM created_at) = EXTRACT(YEAR FROM now());
  
  new_number := 'LK-' || year || '-' || LPAD(count::TEXT, 5, '0');
  RETURN new_number;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER SET search_path = public;

-- Update set_inquiry_number function
CREATE OR REPLACE FUNCTION public.set_inquiry_number()
RETURNS TRIGGER AS $$
BEGIN
  IF NEW.number IS NULL OR NEW.number = '' THEN
    NEW.number := public.generate_inquiry_number();
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER SET search_path = public;

-- Update handle_new_user function
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
$$ LANGUAGE plpgsql SECURITY DEFINER SET search_path = public;