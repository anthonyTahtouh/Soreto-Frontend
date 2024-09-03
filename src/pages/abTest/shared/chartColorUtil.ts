const colors = ['#334d5c', '#46b29d', '#a7c5eb', '#f4d35e', '#ee8572'];

const getChartColor = (index: number) => {
  return colors[index % colors.length];
};

const getChartRamdomColor = () => {
  return colors[Math.floor(Math.random() * colors.length)];
};

export { getChartColor, getChartRamdomColor };
