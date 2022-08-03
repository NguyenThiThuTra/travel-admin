export default function CurrencyFormatting(number) {
  return number.toFixed(0).replace(/(\d)(?=(\d\d\d)+(?!\d))/g, '$1,') + ' vnd';
}
