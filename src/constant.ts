export function getChart1Theme() {
  return ['#E44915', '#18CAA3', '#FDBA00', '#1846FD', '#BC18FD', '#86888F'];
}

export function getChart1Datasets(labels = []) {
  const thickerBorderWidth = 4;
  const theme = getChart1Theme();

  return theme.map((t, i) => ({
    label: labels[i] || '',
    data: [],
    borderColor: t,
    pointBorderColor: t,
    borderWidth: thickerBorderWidth,
    pointRadius: thickerBorderWidth - 1,
    pointBorderWidth: 1,
    pointHoverRadius: thickerBorderWidth + 1,
    spanGaps: true,
    parsing: false,
  }));
}

export function getChart2Theme() {
  return ['#CC3300'];
}

export function getChart2Datasets(label) {
  const thickerBorderWidth = 4;
  const theme = getChart2Theme();

  return [
    {
      label,
      data: [],
      borderColor: theme[0],
      pointBorderColor: theme[0],
      borderWidth: thickerBorderWidth,
      pointRadius: thickerBorderWidth - 1,
      pointBorderWidth: 1,
      pointHoverRadius: thickerBorderWidth + 1,
      spanGaps: true,
      parsing: false,
    },
  ];
}

export function getChart3Theme() {
  return ['#3D3D3D'];
}

export function getChart3Datasets(label) {
  const thickerBorderWidth = 4;
  const theme = getChart2Theme();

  return [
    {
      label,
      data: [],
      borderColor: theme[0],
      pointBorderColor: theme[0],
      borderWidth: thickerBorderWidth,
      pointRadius: thickerBorderWidth - 1,
      pointBorderWidth: 1,
      pointHoverRadius: thickerBorderWidth + 1,
      spanGaps: true,
      parsing: false,
    },
  ];
}
