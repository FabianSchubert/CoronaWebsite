/* When the user clicks on the button,
toggle between hiding and showing the dropdown content */
function showCountries() {
  document.getElementById("countryDropdownContent").classList.toggle("show");
}

function showExamples() {
  document.getElementById("exampleDropdownContent").classList.toggle("show");
}

function showDataSets() {
  document.getElementById("dataDropdownContent").classList.toggle("show");
}

	function filterFunction() {
	  var input, filter, ul, li, a, i;
	  input = document.getElementById("myInput");
	  filter = input.value.toUpperCase();
	  div = document.getElementById("countryDropdownContent");
	  a = div.getElementsByTagName("a");
	  a.href = "#"
	  for (i = 0; i < a.length; i++) {
		txtValue = a[i].textContent || a[i].innerText;
		if (txtValue.toUpperCase().indexOf(filter) > -1) {
		  a[i].style.display = "" ;
		} else {
		  a[i].style.display = "none";
		}
	  }
	}






$(document).click(function(event) { 
  $target = $(event.target);
  if(!$target.closest('.dropdown').length) {
    document.getElementById("countryDropdownContent").classList.remove("show");
    document.getElementById("exampleDropdownContent").classList.remove("show");
  }       
});

function changeCountry(){
  
}


$(document).ready(function(){
  $(".dropdown-toggle").dropdown();
});

