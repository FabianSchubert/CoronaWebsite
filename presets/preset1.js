$(function(){
addPlot(countries.indexOf("Germany")).then(
  () => {
    let GermanyBox = $($('.countryBox')[0]);
    GermanyBox.find(".yScale")[0].value = 20;
    GermanyBox.find(".yScale")[0].oninput();
    
    GermanyBox.find('.dateRange').slider("option","values",[46,161]);
    let handle = GermanyBox.find('.dateRange span')[0]
    let ui = {handle: handle, values: GermanyBox.find('.dateRange').slider("option","values")};
    changeRangeSlider(null, ui);
    updateData(GermanyBox);
  });

addPlot(countries.indexOf("Spain")).then(
  () => {
    let SpainBox = $($('.countryBox')[1]);
    SpainBox.find(".yScale")[0].value = 8;
    SpainBox.find(".yScale")[0].oninput();

    SpainBox.find('.dateRange').slider("option","values",[46,161]);
    let handle = SpainBox.find('.dateRange span')[0]
    let ui = {handle: handle, values: SpainBox.find('.dateRange').slider("option","values")};
    changeRangeSlider(null, ui);
    updateData(SpainBox);
  });

addPlot(countries.indexOf("Italy")).then(
  () => {
    let ItalyBox = $($('.countryBox')[2]);
    ItalyBox.find(".yScale")[0].value = 14;
    ItalyBox.find(".yScale")[0].oninput();

    ItalyBox.find(".timeShift")[0].value = 15;
    ItalyBox.find(".timeShift")[0].oninput();

    
    ItalyBox.find('.dateRange').slider("option","values",[46,161]);
    let handle = ItalyBox.find('.dateRange span')[0]
    let ui = {handle: handle, values: ItalyBox.find('.dateRange').slider("option","values")};
    changeRangeSlider(null, ui);
    updateData(ItalyBox);
  });

/*addPlot(countries.indexOf("Spain"));
addPlot(countries.indexOf("Italy"));

debugger;

let GermanyBox = $(addPlot(countries.indexOf("Germany")));
let SpainBox = $(addPlot(countries.indexOf("Spain")));
let ItalyBox = $(addPlot(countries.indexOf("Italy")));

GermanyBox.find(".yScale")[0].value = 20;
GermanyBox.find(".yScale")[0].oninput();

SpainBox.find(".yScale")[0].value = 8;
SpainBox.find(".yScale")[0].oninput();

SpainBox.find(".xScale")[0].value = 11;
SpainBox.find(".xScale")[0].oninput();

ItalyBox.find(".yScale")[0].value = 14;
ItalyBox.find(".yScale")[0].oninput();

ItalyBox.find(".timeShift")[0].value = 15;
ItalyBox.find(".timeShift")[0].oninput();

GermanyBox.find('.dateRange').slider("option","values",[46,161]);
SpainBox.find('.dateRange').slider("option","values",[46,161]);
ItalyBox.find('.dateRange').slider("option","values",[46,161]);

$(".dataTypeButton.xAx.Middle")[0].onclick();
$(".dataTypeButton.yAx.Left")[0].onclick();

updateData(GermanyBox);
updateData(SpainBox);
updateData(ItalyBox);*/
});