(function() {
    var GALLERY_SELECTOR = '.work-gallery';
    var WORK_SELECOTR = '.work';
    var WORK_IMAGE_SELECTOR = '.work-image';
    var WORK_IMAGE_COPY_CLASS = 'work-image--absolute';
    var WORK_IMAGE_COPY_SELECTOR = '.' + WORK_IMAGE_COPY_CLASS;

    var galleries = []; 
    
    var workGalleries = document.querySelectorAll(GALLERY_SELECTOR);

    workGalleries.forEach(function(workGallery) {
        var works = workGallery.querySelectorAll(WORK_SELECOTR);
    
        works.forEach(function(work) {
            var workImage = work.querySelector(WORK_IMAGE_SELECTOR);
            var copyImage = workImage.cloneNode();
            workImage.style.visibility = 'hidden';
            copyImage.classList.add(WORK_IMAGE_COPY_CLASS);

            work.append(copyImage);
        });
        
        var masnory = new Masonry(workGallery, {
                itemSelector: WORK_SELECOTR,
                resize: false,
                originLeft: true
        });
        
        imagesLoaded(workGallery).on('progress', function() {
            layout(masnory, works);
        });

        galleries.push({
            works: works,
            masnory: masnory
        });
    });

    window.onresize = function(event) {
        galleries.forEach(function(gallery) {
            layout(gallery.masnory, gallery.works);
        });
    };

    function layout(masnory, works) {
        works.forEach(function(work) {
            var workImage = work.querySelector(WORK_IMAGE_SELECTOR);
            var copyImage = work.querySelector(WORK_IMAGE_COPY_SELECTOR);

            copyImage.setAttribute('style', 'width: ' + workImage.offsetWidth + 'px;');
        });
        
        masnory.layout();
    }
})();


