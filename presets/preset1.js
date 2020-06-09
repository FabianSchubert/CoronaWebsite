$(function(){
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

console.log(SpainBox.find(".yScale")[0].value);

updateData(GermanyBox);
updateData(SpainBox);
updateData(ItalyBox);
});