-- Custom SQL migration file, put your code below! --

-- Create a function to update the response count
CREATE OR REPLACE FUNCTION update_form_response_count()
RETURNS TRIGGER AS $$
BEGIN
    -- Update the response count in the form table
    UPDATE form.form
    SET responses = responses + 1
    WHERE id = NEW."form_id";
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create a trigger that calls the function after an insert on the response table
CREATE TRIGGER response_insert_trigger
AFTER INSERT ON form.response
FOR EACH ROW
EXECUTE FUNCTION update_form_response_count();
