$(function(){

  addPlot(countries.indexOf("Italy")).then(
  () => {
    let ItalyBox = $($('.countryBox')[0]);
    updateData(ItalyBox);
  });
  
  addPlot(countries.indexOf("Italy")).then(
  () => {
    let ItalyBoxDeaths = $($('.countryBox')[1]);
    
    ItalyBoxDeaths.find(".timeShift")[0].value = -16;
    ItalyBoxDeaths.find(".timeShift")[0].oninput();

    ItalyBoxDeaths.find(".dropdown.chooseData a")[1].onclick();

    updatexDataList();
    let xDataDropdown = $('#xDataDropdown')
    xDataDropdown.find('a')[2].onclick();

    ItalyBoxDeaths.find('.dateRange').slider("option","values",[46,161]);
    let handle = ItalyBoxDeaths.find('.dateRange span')[0]
    let ui = {handle: handle, values: ItalyBoxDeaths.find('.dateRange').slider("option","values")};
    changeRangeSlider(null, ui);

    updateData(ItalyBoxDeaths);
  });


});