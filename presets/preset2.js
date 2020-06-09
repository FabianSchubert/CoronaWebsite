$(function(){
let ItalyBox = $(addPlot(countries.indexOf("Italy")));
let ItalyBoxDeaths = $(addPlot(countries.indexOf("Italy")));

ItalyBoxDeaths.find(".switchCasesDeaths")[0].checked = true;
ItalyBoxDeaths.find(".switchCasesDeaths")[0].onclick();

let yScaleMax = ItalyBoxDeaths.find(".yScale").parent().parent().find('.sliderRangeField')[0];
yScaleMax.value = "10";
yScaleMax.oninput();

ItalyBoxDeaths.find(".scaleLock")[0].onclick();

ItalyBoxDeaths.find(".yScale")[0].value = 35;
ItalyBoxDeaths.find(".yScale")[0].oninput();

$(".dataTypeButton.xAx.Left")[0].onclick();
$(".dataTypeButton.yAx.Left")[0].onclick();

//ItalyBoxDeaths.find(".timeShift")[0].value = -7;
//ItalyBoxDeaths.find(".timeShift")[0].oninput();


updateData(ItalyBox);
updateData(ItalyBoxDeaths);
});