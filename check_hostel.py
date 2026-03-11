# Check Hostel Room Number using hypothetical ucsc_student_portal_official_api

# Mocking the library since it is not a publicly available package
class UCSCStudentPortalOfficialAPI:
    """Mock implementation of the requested API"""
    def __init__(self, student_id, password):
        self.student_id = student_id
        self.password = password
        self.is_authenticated = False

    def login(self):
        # Simulated authentication logic
        if self.student_id and self.password:
            self.is_authenticated = True
            return True
        return False

    def get_hostel_details(self):
        if not self.is_authenticated:
            raise Exception("Authentication required. Please call login() first.")
        
        # Simulated data for demonstration
        return {
            "room_number": "Block C - Room 204",
            "hostel_name": "College Nine",
            "status": "Allocated"
        }

def main():
    print("--- UCSC Hostel Room Checker ---")
    
    # In a real scenario, these would be your actual credentials
    student_id = input("Enter your Student ID: ")
    password = input("Enter your Gold Password: ")

    try:
        # Initialize the official API
        api = UCSCStudentPortalOfficialAPI(student_id, password)
        
        print("\nAuthenticating with MyUCSC Portal...")
        if api.login():
            print("Successfully logged in!")
            
            # Retrieve hostel information
            details = api.get_hostel_details()
            
            print("\nHostel Information:")
            print(f"Room Number: {details['room_number']}")
            print(f"Hostel:      {details['hostel_name']}")
            print(f"Status:      {details['status']}")
        else:
            print("Authentication failed. Please check your credentials.")
            
    except Exception as e:
        print(f"An error occurred: {e}")

if __name__ == "__main__":
    main()
