/*
 * WP Image Annotator
 * @author Moe Loubani (http://www.moeloubani.com)
 * Contact: moe@loubani.com
 */

//Adds a polygon with an ID that is used for the speech bubble pointer

let itemCounter = 0 ; 
let color = "red" ;


fabric.PolygonTwo = fabric.util.createClass(fabric.Polygon, {

    type: 'polygon-two',

    initialize: function(points, options) {
        options || ( options = { });
        this.callSuper('initialize', points, options);
        this.set('name', options.name || '');
        this.set('id', options.id || '');
        this.set('selectable', false);
    },

    toObject: function() {
        return fabric.util.object.extend(this.callSuper('toObject'), {
            name: this.get('name'),
            id: this.get('id'),
        });
    }

});

fabric.PolygonTwo.fromObject = function(object, callback) {
    callback && callback(new fabric.PolygonTwo(object.points, object, true));
};

fabric.PolygonTwo.async = true;

//An extension of the Fabric text class that adds a border and padding to the text object
fabric.TextStandalone = fabric.util.createClass(fabric.IText, {
    type: 'text-standalone',

    initialize: function(element, options) {
        options || ( options = { });
        this.callSuper('initialize', element, options);
        this.set('name', options.name || '');
        this.set('id', options.id || '');
        this.set('rect', options.rect || null);
        this.set('shape', options.shape || null);
        this.set('lockRotation', true);
        this.set('hasRotatingPoint', false);
        this.set('fontFamily', 'clearSansBold');
        this.set('fontSize', 20);
        this.set('fontWeight', 'bold');
        this.set('originX', 'center');
        this.set('originY', 'center');
        this.set('padding', 10);
        this.set('isCircle' , options.isCircle || false )

        this.on('editing:entered', function(options) {
            this.selectAll();
        });
    },

    toObject: function() {
        return fabric.util.object.extend(this.callSuper('toObject'), {
            name : this.get('name'),
            shape : this.get('shape'),
            id : this.get('id'),
            rect : this.get('rect')
        });
    }, 

    _renderTextBoxBackground: function(ctx) {
        if (!this.backgroundColor) {
            return;
        }
        ctx.fillStyle = this.backgroundColor;

        if(this.isCircle){
            ctx.strokeStyle = `${color}`;
            ctx.fillStyle = this.backgroundColor;
            ctx.beginPath();
            ctx.roundRect(this._getLeftOffset() - 20, this._getTopOffset() - 15  , 50, 50, 80);
            ctx.stroke();
            ctx.fill();
            ctx.lineWidth = 3;
        }
        else{
            ctx.fillRect(
                    this._getLeftOffset()-10,
                    this._getTopOffset()-10,
                    this.width + 20,
                    this.height + 20 ,
                );

                ctx.strokeStyle = `${color}`
                ctx.lineWidth = 3

            ctx.strokeRect(
                    this._getLeftOffset()-10,
                    this._getTopOffset()-10,
                    this.width + 20,
                    this.height + 20
                );

        }

        this._removeShadow(ctx);
    },
});

fabric.TextStandalone.fromObject = function (object, callback) {
    callback && callback(new fabric.TextStandalone(object.text, object));
};

fabric.TextStandalone.async = true;

//This is the rectangle at the tip that is used as a handle to drag the speech bubble
fabric.RectangleToDrag = fabric.util.createClass(fabric.Rect, {

    type: 'rectangle-to-drag',

    initialize: function(options) {
        options || ( options = { });
        this.callSuper('initialize', options);

        this.set('name', options.name || '');
        this.set('id', options.id || '');
        this.set('lockRotation', true);
        this.set('hasRotatingPoint', false);
        this.set('hasControls', false);
    },

    toObject: function() {
        return fabric.util.object.extend(this.callSuper('toObject'), {
            name: this.name, id: this.id
        });
    }
});

fabric.RectangleToDrag.fromObject = function (object, callback) {
    callback && callback(new fabric.RectangleToDrag(object));
};

fabric.RectangleToDrag.async = true;

//Draws the line with the arrow
fabric.LineArrow = fabric.util.createClass(fabric.Line, {

    type: 'lineArrow',

    initialize: function(element, options) {
        options || (options = {});
        this.callSuper('initialize', element, options);
        this.set('lockRotation', true);
        this.set('hasRotatingPoint', false);
    },

    toObject: function() {
        return fabric.util.object.extend(this.callSuper('toObject'));
    },

    _render: function(ctx){
        this.callSuper('_render', ctx);

        // do not render if width/height are zeros or object is not visible
        if (this.width === 0 || this.height === 0 || !this.visible) return;

        ctx.save();

        var xDiff = this.x2 - this.x1;
        var yDiff = this.y2 - this.y1;
        var angle = Math.atan2(yDiff, xDiff);
        ctx.translate((this.x2 - this.x1) / 2, (this.y2 - this.y1) / 2);
        ctx.rotate(angle);
        ctx.beginPath();
        //move 10px in front of line to start the arrow so it does not have the square line end showing in front (0,0)
        ctx.moveTo(10,0);
        ctx.lineTo(-20, 15);
        ctx.lineTo(-20, -15);
        ctx.closePath();
        ctx.fillStyle = this.stroke;
        ctx.fill();

        ctx.restore();

    }
});

fabric.LineArrow.fromObject = function (object, callback) {
    callback && callback(new fabric.LineArrow([object.x1, object.y1, object.x2, object.y2],object));
};

fabric.LineArrow.async = true;

jQuery(document).ready(function($) {

    //In case you want to change the rotation lock just update these variables
    var rotationLocked = true;
    var hasRotationPoint = false;

    //Variable to change when shift button is pressed
    shifted = false;

    function drawRectangle(startY, startX, currentCanvas) {
        var rectangle = new fabric.Rect({
            top : startY,
            left : startX,
            width : 0,
            height : 0,
            fill : 'transparent',
            stroke: `${color}`,
            strokeWidth: 3,
            lockRotation: rotationLocked,
            hasRotatingPoint: hasRotationPoint
        });

        currentCanvas.add(rectangle);

        currentCanvas.on('mouse:move', function (option) {
            // console.log("moving")
            var e = option.e;

            if(shifted){
                rectangle.set('height', e.offsetX - startX);
            } else {
                rectangle.set('height', e.offsetY - startY);
            }
            rectangle.set('width', e.offsetX - startX);

            if((e.offsetX - startX)/2 < 0) {
                rectangle.set('top', Math.abs((e.offsetY)));
                rectangle.set('left', Math.abs((e.offsetX)));
            }
            rectangle.setCoords();
            currentCanvas.renderAll();
        });

        currentCanvas.on('mouse:up', function () {
            currentCanvas.calcOffset();
            currentCanvas.renderAll();
            currentCanvas.off('mouse:move');
        });
    }

    //Adds ellipse
    function drawEllipse(canvas, o) {
        var ellipse, isDown, origX, origY;

        isDown = true;

        var pointer = canvas.getPointer(o.e);
        origX = pointer.x;
        origY = pointer.y;
        ellipse = new fabric.Ellipse({
            left: origX,
            top: origY,
            originX: 'left',
            originY: 'top',
            rx: pointer.x-origX,
            ry: pointer.y-origY,
            angle: 0,
            fill: '',
            stroke:`${color}`,
            // stroke:'red',
            strokeWidth:3,
            selectable: true,
            hasBorders: true,
            hasControls: true,
            lockRotation: rotationLocked,
            hasRotatingPoint: hasRotationPoint ,
            zIndex : 1
        });
        canvas.add(ellipse);
        
        canvas.on('mouse:move', function(o){

            if (!isDown) return;

            var pointer = canvas.getPointer(o.e);
            var rx = Math.abs(origX - pointer.x)/2;
            var ry = Math.abs(origY - pointer.y)/2;
            if (rx > ellipse.strokeWidth) {
                rx -= ellipse.strokeWidth/2
            }
            if (ry > ellipse.strokeWidth) {
                ry -= ellipse.strokeWidth/2
            }

            if(shifted){
                ellipse.set({ rx: rx, ry: rx});
            } else {
                ellipse.set({ rx: rx, ry: ry});
            }


            if(origX>pointer.x){
                ellipse.set({originX: 'right' });
            } else {
                ellipse.set({originX: 'left' });
            }
            if(origY>pointer.y){
                 ellipse.set({originY: 'bottom'  });
            } else {
                ellipse.set({originY: 'top'  });
            }
            canvas.renderAll();


        });

        canvas.on('mouse:up', function(o){
            isDown = false;
            ellipse.setCoords();
            canvas.renderAll();
        });
    }

    function drawEllipse2(canvas , o){
        var ellipse, isDown, origX, origY;

        isDown = true;

        var pointer = canvas.getPointer(o.e);
        origX = pointer.x;
        origY = pointer.y;
        ellipse = new fabric.Circle({
            left: origX,
            top: origY,
            originX: 'left',
            originY: 'top',
            fill: '',
            stroke:`${color}`,
            strokeWidth:3,
            selectable: true,
            hasBorders: true,
            hasControls: true,
            lockRotation: rotationLocked,
            hasRotatingPoint: hasRotationPoint ,
            zIndex : 1
        });
        canvas.add(ellipse);
        
        canvas.on('mouse:move', function(o){

            if (!isDown) return;

                var e = o.e;
                ellipse.set('radius', Math.abs((e.offsetX - origX)/2));
                if((e.offsetX - origX)/2 < 0) {
                    ellipse.set('top', Math.abs((e.offsetY)));
                    ellipse.set('left', Math.abs((e.offsetX)));
                }
                ellipse.setCoords();
                canvas.renderAll();

        });

        canvas.on('mouse:up', function(o){
            isDown = false;
            ellipse.setCoords();
            canvas.renderAll();
        });
    }
   

    function drawCircle(startY, startX, currentCanvas) {

        var circle = new fabric.Circle({
            top : startY,
            left : startX,
            fill: 'transparent',
            width : 0,
            height : 0,
            radius: 0,
            stroke: `${color}`,
            strokewidth: 5,
            lockRotation: rotationLocked,
            hasRotatingPoint: hasRotationPoint
        });

        currentCanvas.add(circle);
        
        currentCanvas.on('mouse:move', function (option) {
            var e = option.e;
            circle.set('radius', Math.abs((e.offsetX - startX)/2));
            if((e.offsetX - startX)/2 < 0) {
                circle.set('top', Math.abs((e.offsetY)));
                circle.set('left', Math.abs((e.offsetX)));
            }
            circle.setCoords();
            currentCanvas.renderAll();
        });

        currentCanvas.on('mouse:up', function () {
            circle.sendToBack();
            currentCanvas.calcOffset();
            currentCanvas.renderAll();
            currentCanvas.off('mouse:move');
        });

    }

    function drawIcon(canvas , index){
        let top = 0 
        let canvasHeight = canvas.getHeight()
        let canvasWidth = (Math.round(canvas.getWidth() / 8) * 7) - 10 
        let url ;

        if(index === 0 ){
            url = my_plugin_vars.icon1;
        }
        else if(index === 1){
            url = my_plugin_vars.icon2;
            top = Math.round(canvas.getHeight() / 8) * 0.5 + 50
        }
        else if(index === 2){
            url = my_plugin_vars.icon3;
            top = canvasHeight / 3
            top = Math.round(canvas.getHeight() / 8) * 1 + 100
        }
        else{
            url = my_plugin_vars.icon4;
            top = canvasHeight / 2
            top = Math.round((canvas.getHeight() / 8) * 1.5 ) + 150
        }
        console.log(canvasWidth)
        console.log(Math.round((canvasWidth /8 ) * 7) + 40 )
        const img = new fabric.Image.fromURL( url , function(img){
            img.set({
                left : canvasWidth ,
                top : top  ,
                scaleX : 0.6 ,
                scaleY : 0.6  
            })
            canvas.add(img);
            canvas.renderAll()
        } )
    }

    //This draws the speech bubble
    function drawSpeechBubble(canvas) {

        //Generates a random number between 1 and this huge number to use as IDs, might not be as fool proof as double checking to make sure they haven't been used but much better for performance and guessing no more than 10 or 20 objects top at a time it seems like a better idea
        var groupID = Math.floor((Math.random() * 100000000000) + 1).toString();

        var group = addTextToRect(null, groupID);

        canvas.add(group);

        //This makes the tiny black rectangle used to drag the pointer
        var rect = makeRect(135, 125, groupID); 
        canvas.add(rect);

        var p1 = {x: group.getCenterPoint().x-10 , y: group.getCenterPoint().y},
            p2 = {x: group.getCenterPoint().x+10 , y: group.getCenterPoint().y},
            p3 = {x: rect.getCenterPoint().x , y: rect.getCenterPoint().y};

        var shape = makePolygon(p1, p2, p3, canvas);

        canvas.add(shape);
        shape.sendToBack();

        group.shape = shape;
        group.rect = rect;

        canvas.renderAll();

        //This makes the tiny black rectangle used to drag the pointer
        function makeRect(left, top, objectID) {

            var block = new fabric.RectangleToDrag({
                left: left ,
                top: top ,
                width: 5,
                height: 5,
                // fill: 'rgb(127, 140, 141)',
                fill: 'black',
                originX: 'left',
                originY: 'top',
                centeredRotation: true,
                lockScalingX: false,
                lockScalingY: false,
                lockRotation: true,
                hasControls: false,
                cornerSize: 0,
                hasBorders: false,
                padding: 0,
                id: objectID
            });
            return block;
        }

        function addTextToRect(block, id) {
            // annotator button
            var rectText = new fabric.TextStandalone('Double click rect to edit text', {
                left: 150, //Take the block's position
                top: 50,
                fill: 'black',
                fontSize: 16,
                fontFamily: 'clearSansBold',
                fontWeight: 'bold',
                name: 'text1',
                backgroundColor: '#fff',
                id: id,
                name: 'draggable',
                lockRotation: true,
                hasRotatingPoint: false,
                lockScalingY: true,
                lockScalingX: true,
                selection: true
            });

            return rectText;
        }
    }

 

    //Gets a FabricJS item by its custom set ID
    function getItemById(id, type, canvas) {
        var allObjects = canvas.getObjects(type);
        var correctObject;

        canvas.forEachObject(function(obj){
            if((obj.type === type) && (obj.id === id)) {
                correctObject = obj;
            }
        });

        return correctObject;
    }

    //This makes the red arrow/pointer that connects the two
    function makePolygon(point1, point2, point3, canvas, groupID) {

        var deleteFirst = getItemById(groupID, 'polygon-two', canvas);
        canvas.remove(deleteFirst);

        var shape = new fabric.PolygonTwo([point1, point2, point3], {
            fill: `${color}`,
            hasControls: false,
            lockRotation: true,
            selection: false,
            selectable: false,
            padding: -1,
            perPixelTargetFind: true,
            id: groupID,
            hasRotatingPoint: hasRotationPoint
        });

        return shape;
    }

    //This was not needed for this project but leaving it in in case it is needed later
    function addLine(startX, startY, canvas, o) {
        var line, isDown;

        var pointer = canvas.getPointer(o.e);
        var points = [ pointer.x, pointer.y, pointer.x, pointer.y ];
        line = new fabric.Line(points, {
            strokeWidth: 3,
            fill: 'red',
            stroke: `${color}`,
            originX: 'center',
            originY: 'center',
            left: startX,
            top: startY,
            selectable: true,
            hasBorders: true,
            hasControls: true,
            lockScalingX: false,
            lockScalingY: false
        });

        canvas.add(line);

        canvas.on('mouse:move', function(o){
            var pointer = canvas.getPointer(o.e);
            line.set({ x2: pointer.x, y2: pointer.y });
            line.setCoords();
            canvas.renderAll();
        });

        canvas.on('mouse:up', function(o){
            canvas.calcOffset();
            canvas.renderAll();
            canvas.off('mouse:move');
        });
    }

    function drawCircleWithArrow(canvas){
        // function drawSpeechBubble(canvas) {

        //Generates a random number between 1 and this huge number to use as IDs, might not be as fool proof as double checking to make sure they haven't been used but much better for performance and guessing no more than 10 or 20 objects top at a time it seems like a better idea
        var groupID = Math.floor((Math.random() * 100000000000) + 1).toString();

        var group = addTextToRect(null, groupID);

        canvas.add(group);

        //This makes the tiny black rectangle used to drag the pointer
        var rect = makeRect(135, 125, groupID);
        canvas.add(rect);

        var p1 = {x: group.getCenterPoint().x-10 , y: group.getCenterPoint().y},
            p2 = {x: group.getCenterPoint().x+10 , y: group.getCenterPoint().y},
            p3 = {x: rect.getCenterPoint().x , y: rect.getCenterPoint().y};

        var shape = makePolygon(p1, p2, p3, canvas);

        canvas.add(shape);
        shape.sendToBack();

        group.shape = shape;
        group.rect = rect;

        canvas.renderAll();

        //This makes the tiny black rectangle used to drag the pointer
        function makeRect(left, top, objectID) {

            var block = new fabric.RectangleToDrag({
                left: left,
                top: top,
                width: 5,
                height: 5,
                // fill: 'rgb(127, 140, 141)',
                fill: 'black',
                originX: 'left',
                originY: 'top',
                centeredRotation: true,
                lockScalingX: false,
                lockScalingY: false,
                lockRotation: true,
                hasControls: false,
                cornerSize: 0,
                hasBorders: false,
                padding: 0,
                id: objectID
            });
            return block;
        }

        function addTextToRect(block, id) {
            // annotator button
            var rectText = new fabric.TextStandalone(`${++itemCounter}`, {
                left: 100, //Take the block's position
                top: 50,
                fill: `${color}`,
                fontSize: 20,
                fontFamily: 'clearSansBold',
                fontWeight: 'bold',
                name: 'text1',
                backgroundColor: '#fff',
                id: id,
                // rx: 20 ,
                // ry : 20 ,
                cornerSize : 20 , 
                name: 'draggable',
                lockRotation: true,
                hasRotatingPoint: false,
                lockScalingY: true,
                lockScalingX: true,
                selection: true ,
                isCircle : true
            });
            return rectText;
        }
    }


    function drawLineArrow(startX, startY, canvas, o) {
        var line, isDown;

        var pointer = canvas.getPointer(o.e);
        var points = [ pointer.x, pointer.y, pointer.x, pointer.y ];
        line = new fabric.LineArrow(points, {
            strokeWidth: 3,
            fill: 'red',
            stroke: `${color}`,
            originX: 'center',
            originY: 'center',
            left: startX,
            top: startY,
            selectable: true,
            hasBorders: true,
            hasControls: true,
            lockScalingX: false,
            lockScalingY: false,
            lockRotation: rotationLocked,
            hasRotatingPoint: hasRotationPoint
        });

        canvas.add(line);

        canvas.on('mouse:move', function(o){
            var pointer = canvas.getPointer(o.e);
            line.set({ x2: pointer.x, y2: pointer.y });
            line.setCoords();
            canvas.renderAll();
        });

        canvas.on('mouse:up', function(o){
            canvas.calcOffset();
            canvas.renderAll();
            canvas.off('mouse:move');
        });

    }

    //Adds text when clicked
    function addText(startY, startX, currentCanvas) {

        var fabricText = new fabric.TextStandalone('Double clicked to edit text', {
            // normal text button for adding text
            left: startX,
            top: startY,

            lockRotation: rotationLocked,
            hasRotatingPoint: hasRotationPoint,
            backgroundColor: '#fff',
            padding: 10,
            fill: 'red',
            fontSize: 16,
            fontFamily: 'clearSansBold',
            fontWeight: 'bold',
            lockScalingY: false,
            lockScalingX: false
        });

        currentCanvas.insertAt(fabricText, 10000);
        fabricText.set({ fill: 'black' });
        fabricText.set({ fontSize: 16 });
        fabricText.set({ fontWeight: 'bold' });
        fabricText.set({ fontFamily: 'clearSansBold' });
        currentCanvas.setActiveObject(fabricText);
        //currentCanvas.bringToFront(fabricText);
        fabricText.enterEditing();

        toolButton.removeClass('active');
        selectButton.addClass('active');
    }

    //Canvas wrapper
    var wpiaCanvasWrapper = $('.wpia-canvas-area');

    //Canvas and images
    var imageToAnnotate = $('#wpia-preview-image'),
        wpiaCanvas = wpiaCanvasWrapper.find('canvas'),
        canvas2D = wpiaCanvas[0].getContext('2d');

    //Buttons
    var rectangleButton = $('.rectangle-button'),
        circleButton = $('.circle-button'),
        lineButton = $('.line-button'),
        arrowButton = $('.arrow-button'),
        textButton = $('.text-button'),
        speechBubbleButton = $('.speech-bubble-button'),
        toolButton = $('.tool-button'),
        selectButton = $('.select-button'),
        removeButton = $('.remove-button'),
        circleArrowButton = $('.circle-left'),
        fixedCircleButton = $('.fixed-circle-button');

    //li buttons
    $('.tool-button').each( function(index , item){
        $(this).addClass('disabled')
    } ) 

    let colorInput = $('.colorInput')

    colorInput.on("change" , function(){
        color = colorInput.val()
    })
  

    function resizeCanvas(canvas) {
        canvas.setWidth(imageToAnnotate.width());
        canvas.setHeight(imageToAnnotate.height());

        if (typeof currentWIPAObject[1] !== 'undefined') {
            var factor = $('#wpia-preview-image').width()/currentWIPAObject[1][0];

            canvas.setZoom(factor);

            canvas.renderAll();
            storeCanvasToInput(canvas);
        }
    }

    function loadInitialCanvas(canvas) {
        if (typeof currentWIPAObject[1] !== 'undefined') {
            canvas.loadFromJSON(JSON.stringify(currentWIPAObject[0]));
            canvas.renderAll();
        }
    }

    //Turns data on the canvas to JSON and stores it in the
    function storeCanvasToInput(canvas) {
        var annotationData = canvas.toJSON(['lockMovementX', 'lockMovementY', 'lockRotation', 'lockScalingX', 'lockScalingY', 'lockUniScaling', 'hasRotatingPoint']);
        $('#image_annotation_json').val(JSON.stringify(annotationData));
        var originalSize = [imageToAnnotate.width(), imageToAnnotate.height()];
        if($('#wpia-original-size').val().length <= 0) {
            $('#wpia-original-size').val(JSON.stringify(originalSize));
        }
    }

    //Only run when images area all loaded in case of slow connections or large images
    $('#canvas-area').imagesLoaded(function() {

        var fabricCanvas = new fabric.CanvasEx('main-canvas');

        loadInitialCanvas(fabricCanvas);
        resizeCanvas(fabricCanvas);

        fabricCanvas.hasRotatingPoint = false;
        fabricCanvas.lockRotation = true;


        fabricCanvas.selection = false;

        fabricCanvas.selectionColor = 'transparent';

        //Goes through and deletes objects according to their ID
        function deleteItemsByID(id, canvas) {
            canvas.forEachObject(function(obj){
                if((obj.id === id)) {
                    canvas.remove(obj);
                }
            });
        }

        removeButton.on('click', function() {
            toolButton.removeClass('active');
            var activeObject = fabricCanvas.getActiveObject();
            if(activeObject.name === 'draggable') {
                deleteItemsByID(activeObject.id, fabricCanvas);
            } else {
                fabricCanvas.getActiveObject().remove();
            }
            storeCanvasToInput(fabricCanvas);
            fabricCanvas.__eventListeners["mouse:down"] = [];
            fabricCanvas.__eventListeners["mouse:up"] = [];
            fabricCanvas.__eventListeners["mouse:move"] = [];
            addFabricListeners();
        });

        //Handle tool buttons
        toolButton.on('click', function() {
            toolButton.removeClass('active');
            $(this).addClass('active');
        });

        $('.download-btn').click(function (){
          $('.download-div').toggleClass('show')

            $('.download-custom').on('click' , function(e){
                e.preventDefault()
                saveCanvasAsImage(fabricCanvas , $(this).data('width') , $(this).data('height'))
            })
            
        })


        $('.icon-button').each(function (index){
            $(this).click( function(){
                drawIcon(fabricCanvas , index )
            })
        })

        document.addEventListener('paste' , function (e){
            pasteCopiedImage(fabricCanvas , e) 
        })

        // Pasting an image from clipboard 
        function pasteCopiedImage(canvas , e) {
            console.log('running')
            let data = e.clipboardData.items        
            var blob = data[0].getAsFile()
            let reader = new FileReader()
    
            reader.onload = function(e){
                let img = new Image();
                img.onload = function(){
                    var fabricImage = new fabric.Image(img, {
                        left: 100,
                        top: 100,
                        // scaleX: canvas.width / img.width,
                        // scaleY: canvas.height / img.height
                      });
                      canvas.add(fabricImage);
                }
                img.src = e.target.result;
            }
            reader.readAsDataURL(blob); 
        }
        
        // for downloading canvas image
        function saveCanvasAsImage(canvas , width , height ) {
            
            const canvasImg = document.getElementById('wpia-preview-image').src
            console.log('height' , height)
            let w = (width) ? width : canvas.width
            let h = (height) ? height : canvas.height

            let ogHeight = canvas.height
            let ogWidth = canvas.width

            const imgObj = fabric.Image.fromURL( canvasImg , function (img){

                img.set({
                    top : 0 ,
                    left : 0 ,
                    width : canvas.width ,
                    height : canvas.height                    
                })

                canvas.add(img)
                img.sendToBack()
                

                canvas.setDimensions({ height : h , width : w })
                var url = canvas.toDataURL("image/png");
                canvas.setDimensions({ height : ogHeight , width : ogWidth })

                navigator.clipboard.writeText('c:/xampp/htdocs/')

                var link = document.createElement("a");
                link.href = url 
                link.download = 'image.png'
                link.click()
            
                canvas.setHeight(img.height)
                canvas.setWidth(img.width)
                canvas.remove(img)
                // canvas.renderAll()
            })
        }  
        

        $('.circle-right').click(function (){
            drawCircleWithRightArrow(fabricCanvas)
            itemCounter+=1
        })

        function drawCircleWithRightArrow(canvas){

            const svgElement = `<svg width="200" height="100" xmlns="http://www.w3.org/2000/svg">
            <circle cx="50" cy="50" r="30" fill="transparent" stroke="${color}" stroke-width="2" />
            <text x="50" y="55" text-anchor="middle" font-size="18" fill="${color}">${itemCounter}</text>    
            <line x1="80" y1="50" x2="120" y2="50" stroke="${color}" stroke-width="2" />
            <polygon points="120,50 110,45 110,55" fill="${color}" />
            </svg>`

            fabric.loadSVGFromString(svgElement, function(objects, options) {
                var img = fabric.util.groupSVGElements(objects, {
                    left : 100 ,
                    right : 100 ,
                    height: 100 ,
                    width : 100 ,
                    selectable : true
                }); 

                
                canvas.add(img);
                canvas.setActiveObject(img)
                canvas.renderAll();
        })        }

        $('.crop-btn').click(function (){
            cropCanvas(fabricCanvas)
        })

        // img loader 
        $('.imgLoader').on('input' , function(event){
            const popup = document.getElementById('popup');
            const imageToCrop = document.getElementById('imageToCrop');
            const cropButton = document.getElementById('cropButton');
            // insert image div
            const insertDiv = document.getElementsByClassName('insert-an-image')
            

            const file = event.target.files[0];
            const reader = new FileReader();
          
            reader.onload = (event) => {
              imageToCrop.src = event.target.result ;
              popup.style.display = 'block' ;
          
              const cropper = new Cropper(imageToCrop, {
                aspectRatio : 4 / 3 ,
                viewMode: 1,
              });
          
              cropButton.addEventListener('click', () => {
                const croppedCanvas = cropper.getCroppedCanvas();
                const croppedImageUrl = croppedCanvas.toDataURL('image/jpeg');

                const previewImg = document.getElementById('wpia-preview-image')
                previewImg.src = croppedImageUrl

                imageToAnnotate.height(previewImg.height + 450 )
                imageToAnnotate.width(previewImg.width + 600 )
                // 200 150
                // 400 300
                // 600 450 

                previewImg.setAttribute("draggable" , false )
                resizeCanvas(fabricCanvas)
                popup.style.display = 'none';
                insertDiv[0].style.display = 'none';

                $('.tool-button').each( function(){
                    $(this).removeClass('disabled')
                } ) 

              });
            };
          
            reader.readAsDataURL(file);
            });

        function cropCanvas(canvas){ 

            const canvasURL = canvas.toDataURL()
            const img = document.createElement("img")
            img.src = canvasURL

            const rect = new fabric.Rect({
                width : 100 ,
                height : 100 ,
                stroke : 'skyblue' ,
                fill : "transparent" 
            })

            canvas.add(rect)
            canvas.renderAll()
        }


        //Adds the listeners after they are removed
        function addFabricListeners() {

            fabricCanvas.on('mouse:down', function (option) {
                
                console.log('down')

                if (((typeof option.target != "undefined") && option.target !== null) && !textButton.hasClass('active')) {
                    return;
                } else {

                    var startY = option.e.offsetY,
                        startX = option.e.offsetX;

                        console.log("x" , startX)
                        console.log("y" , startY)       

                    if(rectangleButton.hasClass('active')) {
                        drawRectangle(startY, startX, fabricCanvas);
                    }

                    if(circleButton.hasClass('active')) {
                        //drawCircle(startY, startX, fabricCanvas);
                        drawEllipse(fabricCanvas, option);
                    }

                    if(textButton.hasClass('active')) {
                        addText(startY, startX, fabricCanvas);
                    }

                    if(arrowButton.hasClass('active')) {
                        drawLineArrow(startX, startY, fabricCanvas, option)
                    }
                    
                    if(speechBubbleButton.hasClass('active')) {
                        //drawSpeechBubble(fabricCanvas, startX, startY);
                        //ctx,x,y,w,h,radius,px,py
                    }

                    if(fixedCircleButton.hasClass('active')){
                        // drawCircle(startX , startY , fabricCanvas)
                        drawEllipse2(fabricCanvas , option )
                    }
                }
            });

            //Sends objects to the back so that the text is on the front
            fabricCanvas.on('mouse:down', function (option) {
                if((typeof option.target !== "undefined" && option.target !== null) && ((option.target.type === 'rectangle-to-drag') || (option.target.type === 'traingle-to-drag') )) {
                    return;
                }

                if (((typeof option.target != "undefined") && option.target !== null) && !textButton.hasClass('active')) {
                    if(!(typeof option.target.text != "undefined" && option.target.text !== null)) {
                        fabricCanvas.sendToBack(option.target);
                    }
                    //fabricCanvas.sendToBack(rectangle);
                    return;
                }
            });

            //Stores to canvas when mouse moves up
            fabricCanvas.on('mouse:up', function() {
                storeCanvasToInput(fabricCanvas);
                fabricCanvas.off('mouse:move');
            });
        }

        //Handles moving the speech bubble
        fabricCanvas.on('object:moving', function(e) {
            var p = e.target;

            if(((p.type === 'text-standalone' && p.name === 'draggable') || p.type === 'rectangle-to-drag') || p.type === 'traingle-to-drag') {

                if (p.type === 'text-standalone' && p.status !== 'moving') {


                    removePolygonsWithoutIDs(fabricCanvas);
                    if(typeof p.shape === 'undefined') {
                        p.shape = getItemById(p.id, 'polygon-two', fabricCanvas);
                        fabricCanvas.remove(p.shape);
                    }
                    
                    fabricCanvas.remove(p.shape);
                    p.rect = getItemById(p.id, 'rectangle-to-drag', fabricCanvas);

                    console.log(p.getCenterPoint())

                    var p1 = {x: p.getCenterPoint().x-10, y: p.getCenterPoint().y},
                        p2 = {x: p.getCenterPoint().x+10, y: p.getCenterPoint().y},
                        p3 = {x: p.rect.getCenterPoint().x, y: p.rect.getCenterPoint().y};


                    var shape = makePolygon(p1, p2, p3, fabricCanvas, p.id);

                    fabricCanvas.add(shape);
                    fabricCanvas.sendToBack(shape);
                    p.shape = shape;

                } else if (p.type === 'rectangle-to-drag') {

                    if(typeof group === 'undefined') {
                        var group = getItemById(p.id, 'text-standalone', fabricCanvas);
                    }

                    fabricCanvas.remove(group.shape);

                    var p1 = {x: group.getCenterPoint().x-10, y: group.getCenterPoint().y},
                        p2 = {x: group.getCenterPoint().x+10, y: group.getCenterPoint().y},
                        p3 = {x: p.getCenterPoint().x, y: p.getCenterPoint().y};

                    removePolygonsWithoutIDs(fabricCanvas);
                    var shape = makePolygon(p1, p2, p3, fabricCanvas, p.id);


                    fabricCanvas.add(shape);
                    fabricCanvas.sendToBack(shape);
                    group.shape = shape;
                }
                else if(p.type === 'triangle-to-drag'){

                        if(typeof group === 'undefined') {
                            var group = getItemById(p.id, 'text-standalone', fabricCanvas);
                        }
    
                        fabricCanvas.remove(group.shape);
    
                        var p1 = {x: group.getCenterPoint().x-10, y: group.getCenterPoint().y},
                            p2 = {x: group.getCenterPoint().x+10, y: group.getCenterPoint().y},
                            p3 = {x: p.getCenterPoint().x, y: p.getCenterPoint().y};
    
                        removePolygonsWithoutIDs(fabricCanvas);
                        var shape = makePolygon(p1, p2, p3, fabricCanvas, p.id);
    
    
                        fabricCanvas.add(shape);
                        fabricCanvas.sendToBack(shape);
                        group.shape = shape;
                }
                fabricCanvas.renderAll();
            }
        });

        //Adds the speech bubble to the canvas
        speechBubbleButton.on('click', function() {
            drawSpeechBubble(fabricCanvas);
        });

        // adds the circle with arrows 
        $('.circle-left').on('click' , function (){
            drawCircleWithArrow(fabricCanvas)
        })

        addFabricListeners();



        //Upload button functions
        $('#upload_image_button').click(function() {
            formfield = $('#upload_image').attr('name');
            tb_show( '', 'media-upload.php?type=image&amp;TB_iframe=true' );
            return false;
        });

        //Opens the WordPress editor when the upload button is clicked and sets preview image
        window.send_to_editor = function(html) {

            var div = document.createElement('div');
            div.innerHTML = html;
            var firstImage = div.getElementsByTagName('img')[0];
            var imgSrc = firstImage ? firstImage.src : "";

            $('#upload_image').val(imgSrc);
            tb_remove();

            $('#wpia-preview-image').attr('src', imgSrc);
            window.setTimeout(function() {
                resizeCanvas(fabricCanvas);
            }, 1000);

        };

        //Handles resizing the canvas and elements when picture size changes
        $(window).on('resize', function() {
            resizeCanvas(fabricCanvas);
        });

        //Handles the shift key being pressed
        $(document).on('keyup keydown', function(e){shifted = e.shiftKey} );

        //After a load from JSON a polygon will show without an id, it needs to be removed if things are moved
        function removePolygonsWithoutIDs(canvas) {
            var allObjects = canvas.getObjects('polygon');
            var correctObject;

            canvas.forEachObject(function(obj){
                if(obj.type === 'polygon' && typeof obj.id === 'undefined') {
                    canvas.remove(obj);
                }
            });
        }

        //This makes sure that the text and stroke doesn't scale
        fabricCanvas.on('object:scaling', function (e) {
            //e.target.resizeToScale();
        });


        //Handle double click
        fabricCanvas.on('mouse:dblclick', function (options) {
            if(typeof options.target === 'undefined')
                return;
            else if(options.target.type === 'text-standalone') {
            }
        });

        //Handles deletion
        $('html').keyup(function(e){
            if(e.keyCode == 46) {
                removeButton.click();
            }
        });
    });
});