<?php

class WPIA_Metaboxes {

    public function __construct()
    {
        add_action('add_meta_boxes', array($this, 'wpia_register_edit_area'));
        add_action('save_post', array($this, 'wpia_save_meta_box'));
    }


    function wpia_register_edit_area() {
        add_meta_box( 'wpia-meta',
            __( 'Image Annotation', 'image-annotator' ),
            array($this, 'wpia_display_callback'),
            'annotation'
        );
    }


    function wpia_display_callback( $post ) {
        
        $image = get_post_meta($post->ID, 'wpia_annotation_image', true);
        $data = get_post_meta($post->ID, 'wpia_annotation_data', true);
        $original_size = get_post_meta($post->ID, 'wpia_annotation_canvas_size', true);
        // $imagePath = '/admin/assets/smile.png';
        ?>

        <div id="upload-area">
            <div class="upload-fields upload-bar">
                <!-- <input id="upload_image" type="text" size="36" name="upload_image" value="<?php echo $image; ?>" />
                <input id="upload_image_button" type="button" value="<?php _e('Choose image', 'image-annotator'); ?>" /> -->
                <label for="file" id="fileImage">
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-image-plus"><path d="M21 12v7a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h7"/><line x1="16" x2="22" y1="5" y2="5"/><line x1="19" x2="19" y1="2" y2="8"/><circle cx="9" cy="9" r="2"/><path d="m21 15-3.086-3.086a2 2 0 0 0-2.828 0L6 21"/></svg>
                    <span>Select Image</span> 
                </label>
                <input type="file" id="file" accept="image/*" class="imgLoader">
                <ul class='buttons'>
                        <li class="download-btn tool-button" data-title="download">
                            <!-- <i class="fa fa-download" aria-hidden="true"></i>  -->
                            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-download"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="7 10 12 15 17 10"/><line x1="12" x2="12" y1="15" y2="3"/></svg>
                            <span>Download</span> 
                        </li>
                        <div class="download-div">
                            <button class="download-custom download-800" data-width="800" data-height="600">Download 800 x 600 </button>
                            <button class="download-custom download-400" data-width="1600" data-height="1200">Download 1600 x 1200 </button>
                            <button class="download-custom download-og-btn">Download Original Size</button>
                        </div>
                </ul> 
            </div>
        </div>
        <div id="work-area">
            <div id="wpia-toolbar">
                <div class="top-bar">
                    <ul class="buttons">
                        <!-- <li data-title='select' class="select-button tool-button active"><i class="fa fa-hand-pointer-o" aria-hidden="true"></i></li> -->
                        <!-- <li data-title='select' class="select-button tool-button active"><i class="fa fa-hand-pointer-o" aria-hidden="true"></i></li> -->
                        <li data-title='select' class="select-button tool-button active"><svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-mouse-pointer-2"><path d="m4 4 7.07 17 2.51-7.39L21 11.07z"/></svg></li>
                        <li data-title="delete" class="remove-button tool-button"><svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-trash-2"><path d="M3 6h18"/><path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6"/><path d="M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2"/><line x1="10" x2="10" y1="11" y2="17"/><line x1="14" x2="14" y1="11" y2="17"/></svg></li>
                        <li data-title="circle" id="circleButton" class="circle-left tool-button" title="arrow with circle"> <svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-message-circle-plus"><path d="M7.9 20A9 9 0 1 0 4 16.1L2 22Z"/><path d="M8 12h8"/><path d="M12 8v8"/></svg></li>
                        <li data-title="Quality" id="iconButton" class="icon1 icon-button tool-button"> <svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-megaphone"><path d="m3 11 18-5v12L3 14v-3z"/><path d="M11.6 16.8a3 3 0 1 1-5.8-1.6"/></svg> </li>
                        <li data-title="Safety" id="iconButton" class="icon2 icon-button tool-button"> <svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-leaf"><path d="M11 20A7 7 0 0 1 9.8 6.1C15.5 5 17 4.48 19 2c1 2 2 4.18 2 8 0 5.5-4.78 10-10 10Z"/><path d="M2 21c0-3 1.85-5.36 5.08-6C9.5 14.52 12 13 13 12"/></svg> </li>
                        <li data-title="Environment" id="iconButton" class="icon3 icon-button tool-button"> <svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-octagon-alert"><polygon points="7.86 2 16.14 2 22 7.86 22 16.14 16.14 22 7.86 22 2 16.14 2 7.86 7.86 2"/><line x1="12" x2="12" y1="8" y2="12"/><line x1="12" x2="12.01" y1="16" y2="16"/></svg> </li>
                        <li data-title="Quality" id="iconButton" class="icon4 icon-button tool-button"> <svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-shield"><path d="M20 13c0 5-3.5 7.5-7.66 8.95a1 1 0 0 1-.67-.01C7.5 20.5 4 18 4 13V6a1 1 0 0 1 1-1c2 0 4.5-1.2 6.24-2.72a1.17 1.17 0 0 1 1.52 0C14.51 3.81 17 5 19 5a1 1 0 0 1 1 1z"/></svg> </li>
                        <input type="color" id="color" class='colorInput' title="choose a color" value="#ff0000">
                    </ul>     
                    <!-- <ul class='buttons'>
                        <li class="download-btn tool-button" data-title="download"> <i class="fa fa-download" aria-hidden="true"></i> Download </li>
                        <div class="download-div">
                            <button class="download-custom download-800" data-width="800" data-height="600">Download 800 x 600 </button>
                            <button class="download-custom download-400" data-width="1600" data-height="1200">Download 1600 x 1200 </button>
                            <button class="download-custom download-og-btn">Download Original Size</button>
                        </div>
                    </ul>    -->
                </div>
                <div class="bottom-div">
                    <ul class='buttons buttons-side'>  
                        <!-- <li class="circle-button tool-button" data-title="ellipse"><i class="fa fa-circle-o"></i></li> -->
                        <li class="circle-button tool-button" data-title="ellipse">
                            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-circle-dashed"><path d="M10.1 2.182a10 10 0 0 1 3.8 0"/><path d="M13.9 21.818a10 10 0 0 1-3.8 0"/><path d="M17.609 3.721a10 10 0 0 1 2.69 2.7"/><path d="M2.182 13.9a10 10 0 0 1 0-3.8"/><path d="M20.279 17.609a10 10 0 0 1-2.7 2.69"/><path d="M21.818 10.1a10 10 0 0 1 0 3.8"/><path d="M3.721 6.391a10 10 0 0 1 2.7-2.69"/><path d="M6.391 20.279a10 10 0 0 1-2.69-2.7"/></svg>
                        </li>
                        <li class="fixed-circle-button tool-button" data-title="circle">
                            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-circle"><circle cx="12" cy="12" r="10"/></svg>
                        </li>
                        <!-- <li class="fixed-circle-button tool-button" data-title="circle"> <i class="fa fa-circle" aria-hidden="true"></i></li> -->
                        <!-- <li class="rectangle-button tool-button" data-title="rectangle"><i class="fa fa-square-o" aria-hidden="true"></i></li> -->
                        <!-- <li class="arrow-button tool-button" data-title="draw arrow"><i class="fa fa-long-arrow-right" aria-hidden="true"></i></li> -->
                        <!-- <li class="text-button tool-button" data-title="text"><i class="fa fa-i-cursor" aria-hidden="true"></i></li> -->
                        <!-- <li class="speech-bubble-button tool-button" data-title="speech bubble"><i class="fa fa-commenting-o" aria-hidden="true"></i></li> -->
                        <li class="rectangle-button tool-button" data-title="rectangle"><svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-square"><rect width="18" height="18" x="3" y="3" rx="2"/></svg></li>
                        <li class="arrow-button tool-button" data-title="draw arrow"><svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-arrow-right"><path d="M5 12h14"/><path d="m12 5 7 7-7 7"/></svg></li>
                        <li class="text-button tool-button" data-title="text"><svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-text-cursor"><path d="M17 22h-1a4 4 0 0 1-4-4V6a4 4 0 0 1 4-4h1"/><path d="M7 22h1a4 4 0 0 0 4-4v-1"/><path d="M7 2h1a4 4 0 0 1 4 4v1"/></svg></li>
                        <li class="speech-bubble-button tool-button" data-title="speech bubble"><svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-message-circle-more"><path d="M7.9 20A9 9 0 1 0 4 16.1L2 22Z"/><path d="M8 12h.01"/><path d="M12 12h.01"/><path d="M16 12h.01"/></svg></li>
                    </ul> 
                <div id="canvas-area" class="wpia-canvas-area">
                    <div class="insert-an-image">
                        <svg xmlns="http://www.w3.org/2000/svg" width="54" height="54" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-images"><path d="M18 22H4a2 2 0 0 1-2-2V6"/><path d="m22 13-1.296-1.296a2.41 2.41 0 0 0-3.408 0L11 18"/><circle cx="12" cy="8" r="2"/><rect width="16" height="16" x="6" y="2" rx="2"/></svg>
                        <h1 >Insert An Image</h1>
                    </div>
                    <img src="<?php echo $image; ?>" id="wpia-preview-image">
                    <!-- <img src="<?php echo $image; ?>" alt="<?php _e('Annotator preview image', 'image-annotator'); ?>" id="wpia-preview-image"> -->
                        <canvas id="main-canvas"></canvas>
                    </div>
                    <img src="" id="testing-image">
                </div>
            </div>

           
        </div>

        <div id="popup">
            <img id="imageToCrop">
            <p> <span id='imp'>*</span> Please crop the image carefully before inserting it, as the image cannot be cropped after it has been inserted.</p>
            <button id="cropButton" type="button">Crop</button>
        </div>

        <div id="croppedImage"></div>


        <div id="popup"><img src="" id="popupImg" alt=""></div> 

        <div id="raw-code">
            <p>Raw JSON for annotations</p>
            <textarea type="text" name="image_annotation" id="image_annotation_json"><?php echo $data; ?></textarea>
        </div>
        <input type="hidden" value="<?php echo $original_size; ?>" name="original_size" id="wpia-original-size">
        <?php
        wp_nonce_field( 'wpia_nonce_verify', 'wpia_nonce' );
    }

    /**
     * Save meta box content.
     *
     * @param int $post_id Post ID
     */
    function wpia_save_meta_box( $post_id ) {
        // Add nonce for security and authentication.
        $nonce_name   = isset( $_POST['wpia_nonce'] ) ? $_POST['wpia_nonce'] : '';
        $nonce_action = 'wpia_nonce_verify';

        // Check if nonce is set.
        if ( ! isset( $nonce_name ) ) {
            return;
        }

        // Check if nonce is valid.
        if ( ! wp_verify_nonce( $nonce_name, $nonce_action ) ) {
            return;
        }

        // Check if user has permissions to save data.
        if ( ! current_user_can( 'edit_post', $post_id ) ) {
            return;
        }

        // Check if not an autosave.
        if ( wp_is_post_autosave( $post_id ) ) {
            return;
        }

        // Check if not a revision.
        if ( wp_is_post_revision( $post_id ) ) {
            return;
        }

        update_post_meta($post_id, 'wpia_annotation_image', $_POST['upload_image']);
        update_post_meta($post_id, 'wpia_annotation_data', $_POST['image_annotation']);
        update_post_meta($post_id, 'wpia_annotation_canvas_size', $_POST['original_size']);

    }
}

new WPIA_Metaboxes();