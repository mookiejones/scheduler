const sortFn = (a, b) => {
  const roundA = parseInt(a[2], 10);
  const posA = parseInt(a[3], 10);
  const roundB = parseInt(b[2], 10);
  const posB = parseInt(b[3], 10);
  const qtyA = parseInt(a[9], 10);
  const qtyB = parseInt(b[9], 10);

  if (roundA === roundB) {
    // if round is the same, sort by round_position
    if (posA === posB) {
      if (qtyA < qtyB) {
        return -1;
      } if (qtyA > qtyB) {
        return 1;
      }
      return 0;
    }
    return posA < posB ? -1 : 1;
  }
  return roundA < roundB ? -1 : 1;
};

export default sortFn;
