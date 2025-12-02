export const toast = {
  success: (message: string) => {
    console.log('✅ Success:', message)
    // You can replace this with your preferred toast library
    // For now, using console.log for demonstration
  },
  error: (message: string) => {
    console.error('❌ Error:', message)
    // You can replace this with your preferred toast library
  }
}