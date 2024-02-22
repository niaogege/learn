export function fillZero(v: string | number) {
  return +v < 10 ? '0' + v : v;
}

export const durationFor = (time: number) => {
  if (!time) return { ss: '00' };
  let t = time;
  const ss = t % 60;
  t = (t - ss) / 60;
  if (t < 1) return { hh: '00', mm: '00', ss: fillZero(+ss) };
  const mm = t % 60;
  t = (t - mm) / 60;
  if (t < 1) return { hh: '00', mm: fillZero(+mm), ss: fillZero(+ss) };
  const hh = t % 24;
  t = (t - hh) / 24;
  if (t < 1) return { hh: fillZero(+hh), mm: fillZero(+mm), ss: fillZero(+ss) };
  const dd = t;
  return { dd: fillZero(dd), hh: fillZero(+hh), mm: fillZero(+mm), ss: fillZero(+ss) };
};
