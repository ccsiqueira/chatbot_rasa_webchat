var dropRegion = document.getElementById("drop-region"),
	// where images are previewed
	imagePreviewRegion = document.getElementById("image-preview");

// open file selector when clicked on the drop region
var fakeInput = document.createElement("input");
fakeInput.type = "file";
fakeInput.accept = "image/*";
fakeInput.multiple = true;
/*
dropRegion.addEventListener('click', function() {
	fakeInput.click();
});
*/

fakeInput.addEventListener("change", function() {
	var files = fakeInput.files;
	handleFiles(files);
});

dropRegion.addEventListener('dragenter', preventDefault, false)
dropRegion.addEventListener('dragleave', preventDefault, false)
dropRegion.addEventListener('dragover', preventDefault, false)
dropRegion.addEventListener('drop', preventDefault, false)

dropRegion.addEventListener('drop', handleDrop, false);


function preventDefault(e) {
	e.preventDefault();
  	e.stopPropagation();
}



function handleDrop(e) {
	var dt = e.dataTransfer,
		files = dt.files;

	handleFiles(files)		
}




function handleFiles(files) {
	for (var i = 0, len = files.length; i < len; i++) {
		if (validateImage(files[i]))
			previewAnduploadImage(files[i]);
	}
}

function validateImage(image) {
	// check the type
	var validTypes = ['image/jpeg', 'image/png', 'image/gif'];
	if (validTypes.indexOf( image.type ) === -1) {
		alert("Invalid File Type");
		return false;
	}

	// check the size
	var maxSizeInBytes = 10e6; // 10MB
	if (image.size > maxSizeInBytes) {
		alert("File too large");
		return false;
	}

	return true;

}

function previewAnduploadImage(image) {
	// container
	var imgView = document.createElement("div");
	imgView.className = "image-view";
	imagePreviewRegion.appendChild(imgView);

	// previewing image
	var img = document.createElement("img");
	imgView.appendChild(img);

	// progress overlay
	var overlay = document.createElement("div");
	overlay.className = "overlay";
	imgView.appendChild(overlay);


	// read the image...
	var reader = new FileReader();
	reader.onload = function(e) {
		img.src = e.target.result;
	}
    //alert(image)
	reader.readAsDataURL(image);

	// create FormData
	var formData = new FormData();
	formData.append('image', image);

	// upload the image
	var uploadLocation = 'image-saver.php';
	
	$.ajax({
        url: uploadLocation,
        data: formData,
        processData: false,
        contentType: false,
		cache: false, 
        type: 'POST',
        success: function(data){
          alert("Success Upload");
        }
    });

	//rasa send
	/*
	{sender_id:,
	msg: image: path
	}
	*/
}