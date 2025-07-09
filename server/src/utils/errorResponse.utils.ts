const errorResponse = (message: string, status: number = 500) => ({
    success: false,
    status: status,
    message,
  });
  
  export default errorResponse;