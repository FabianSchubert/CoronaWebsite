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

    ItalyBoxDeaths.find(".dropdown.chooseData a")[1].onclick()

    updatexDataList();
    let xDataDropdown = $('#xDataDropdown')
    xDataDropdown.find('a')[2].onclick();

    ItalyBoxDeaths.find('.dateRange').slider("option","values",[46,161]);
    let handle = ItalyBoxDeaths.find('.dateRange span')[0]
    let ui = {handle: handle, values: ItalyBoxDeaths.find('.dateRange').slider("option","values")};
    changeRangeSlider(null, ui);

    updateData(ItalyBoxDeaths);
  });

  /*
let ItalyBox = $(addPlot(countries.indexOf("Italy")));
let ItalyBoxDeaths = $(addPlot(countries.indexOf("Italy")));

ItalyBoxDeaths.find(".switchCasesDeaths")[0].checked = true;
ItalyBoxDeaths.find(".switchCasesDeaths")[0].onclick();

let yScaleMax = ItalyBoxDeaths.find(".yScale").parent().parent().find('.sliderRangeField')[0];
yScaleMax.value = "10";
yScaleMax.oninput();

let xScaleMax = ItalyBoxDeaths.find(".xScale").parent().parent().find('.sliderRangeField')[0];
xScaleMax.value = "10";
xScaleMax.oninput();

ItalyBoxDeaths.find(".scaleLock")[0].onclick();

ItalyBoxDeaths.find(".yScale")[0].value = 35;
ItalyBoxDeaths.find(".yScale")[0].oninput();

$(".dataTypeButton.xAx.Left")[0].onclick();
$(".dataTypeButton.yAx.Left")[0].onclick();

//ItalyBoxDeaths.find(".timeShift")[0].value = -7;
//ItalyBoxDeaths.find(".timeShift")[0].oninput();


updateData(ItalyBox);
updateData(ItalyBoxDeaths);*/

});