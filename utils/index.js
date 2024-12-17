export function generateOTP() {
    return Math.floor(100000 + Math.random() * 900000).toString();
  }
  
export function validEmail(email) {
    const regex = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    return regex.test(email);
  }
  
