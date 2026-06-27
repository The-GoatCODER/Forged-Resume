def validate_resume_payload(data: dict) -> tuple[bool, str]:
    if not isinstance(data, dict):
        return False, "Payload must be a valid JSON object."
        
    basics = data.get("basics")
    if not basics or not isinstance(basics, dict):
        return False, "Missing or invalid 'basics' object."
        
    full_name = basics.get("full_name")
    email = basics.get("email")
    
    if not full_name or not str(full_name).strip():
        return False, "'full_name' is missing or empty."
        
    if not email or not str(email).strip() or "@" not in str(email):
        return False, "'email' is missing, empty, or invalid."
        
    for array_field in ["education", "work_experience"]:
        if array_field in data and not isinstance(data[array_field], list):
            return False, f"'{array_field}' field must be a list."
            
    return True, ""