window.CopyToClipBoard = (function() {
    //public API
    return {
       
		ScrollFunction : function(HeaderId,tablecontentId,tableId,sticky,marginLeft,isTrue,isSandbox) {
		//console.log("marginLeft==",tablecontentId);
		//console.log("marginLeft==",tableId);
		//console.log("Sticky==",sticky);
		//console.log("marginLeft==",marginLeft);
		//console.log("marginLeft==",isTrue);
		//console.log("Topdiv==",divId.offsetTop);
		//console.log("Heightdiv==",divId.offsetHeight);
            var header = document.getElementById(HeaderId);
            var tableBody = document.getElementById(tablecontentId);
            var table = document.getElementById(tableId);
            var totalwidth = 0;
            if(tableBody && tableBody.getElementsByTagName("tr").length > 0){
            	var firstRow = tableBody.getElementsByTagName("tr")[0];
                var rowColumns = firstRow.getElementsByTagName("td");
                var headerColums = header.getElementsByTagName("tr")[0].getElementsByTagName("th");
                if(rowColumns.length == headerColums.length){
                    for(var i=0;i<rowColumns.length;i++){
                    //console.log('rowColumns1'+rowColumns[i].offsetWidth);
                   //console.log('tablehead'+headerColums[i].offsetWidth);
                   
                        headerColums[i].style.width = rowColumns[i].offsetWidth+'px';						
                       //console.log('afteraddition_tablehead'+headerColums[i].offsetWidth);
                        //console.log('rowColumns2'+rowColumns[i].offsetWidth);
                        rowColumns[i].style.width = rowColumns[i].offsetWidth+'px';
						
                        totalwidth += rowColumns[i].offsetWidth;
                         //console.log('totaolwidth'+totalwidth);
                    }
                    table.style.width = totalwidth+'px';
                    //console.log('table'+table.offsetWidth);
                }
            }
            
            if (window.pageYOffset > sticky && isTrue == true) {
            //console.log(window.pageYOffset);
                header.classList.add("sticky");
				if(isSandbox){
					header.style.transform = 'translate3d(0px, 125px, 0px)';
				}
				else{
					header.style.transform = 'translate3d(0px, 87px, 0px)';
				}
            } else {
            //console.log('noSticky');
                header.style.transform = 'translate3d(0px, 0px, 0px)';
				header.classList.remove("sticky");
            }
            if(header.classList.contains("sticky")){
            //console.log('margin_left');
                header.style.left = (marginLeft-window.pageXOffset)+'px';
            }
        }
		
    };
}());