const generateMonthRange = (selectedDate: Date) => {
    const year = selectedDate.getFullYear();
    const month = selectedDate.getMonth(); // 0-based (Jan = 0, Dec = 11)
  
    const startOfMonth = new Date(year, month, 1);
    const endOfMonth = new Date(year, month + 1, 0, 23, 59, 59);
  
    return { startOfMonth, endOfMonth };
  };

  export {
    generateMonthRange
  }