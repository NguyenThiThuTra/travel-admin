export default function CurrencyFormatting(number) {
  // number.toFixed(2).replace(/(\d)(?=(\d\d\d)+(?!\d))/g, '$1,') + '₫';
  return number.toFixed(0).replace(/(\d)(?=(\d\d\d)+(?!\d))/g, '$1,') + ' vnd';
}
