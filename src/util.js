const isValidMonth = (month) => {
    const months = ['June', 'July', 'August'];
    const isValid = months.find((m) => m === month);

    return isValid ? true : false;
}

export {
    isValidMonth
}