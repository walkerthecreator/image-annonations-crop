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
            <p>Image to annotate.</p>
            <div class="upload-fields">
                <!-- <input id="upload_image" type="text" size="36" name="upload_image" value="<?php echo $image; ?>" />
                <input id="upload_image_button" type="button" value="<?php _e('Choose image', 'image-annotator'); ?>" /> -->
                <input type="file" accept="image/*" class="imgLoader">
            </div>
        </div>
        <div id="work-area">
            <div id="wpia-toolbar">
                <ul class="buttons">
                    <li title='select' class="select-button tool-button active"><i class="fa fa-hand-pointer-o" aria-hidden="true"></i></li>
                    <li title="delete" class="remove-button"><i class="fa fa-times" aria-hidden="true"></i></li>
                    <li class="circle-button tool-button" title="ellipse"> <i class="fa fa-circle-o"></i></li>
                    <li class="fixed-circle-button tool-button" title="circle"> <i class="fa fa-circle" aria-hidden="true"></i></li>
                    <li class="rectangle-button tool-button" title="rectangle"><i class="fa fa-square-o" aria-hidden="true"></i></li>
                    <li class="arrow-button tool-button" title="draw arrow"><i class="fa fa-long-arrow-right" aria-hidden="true"></i></li>
                    <li class="text-button tool-button" title="text"><i class="fa fa-i-cursor" aria-hidden="true"></i></li>
                    <li class="speech-bubble-button tool-button" title="speech bubble"><i class="fa fa-commenting-o" aria-hidden="true"></i></li>
                    <!-- <li class="crop-btn tool-button" title="crop"> <i class="fa fa-crop"></i>  </li> -->                    
                        <li id="circleButton" class="circle-left tool-button" title="arrow with circle"> <i class="fa fa-arrow-left"></i> </li>
                        <li id="iconButton" class="icon1 icon-button tool-button"> <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-megaphone"><path d="m3 11 18-5v12L3 14v-3z"/><path d="M11.6 16.8a3 3 0 1 1-5.8-1.6"/></svg> </li>
                        <li id="iconButton" class="icon2 icon-button tool-button"> <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-leaf"><path d="M11 20A7 7 0 0 1 9.8 6.1C15.5 5 17 4.48 19 2c1 2 2 4.18 2 8 0 5.5-4.78 10-10 10Z"/><path d="M2 21c0-3 1.85-5.36 5.08-6C9.5 14.52 12 13 13 12"/></svg> </li>
                        <li id="iconButton" class="icon3 icon-button tool-button"> <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-octagon-alert"><polygon points="7.86 2 16.14 2 22 7.86 22 16.14 16.14 22 7.86 22 2 16.14 2 7.86 7.86 2"/><line x1="12" x2="12" y1="8" y2="12"/><line x1="12" x2="12.01" y1="16" y2="16"/></svg> </li>
                        <li id="iconButton" class="icon4 icon-button tool-button"> <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-shield"><path d="M20 13c0 5-3.5 7.5-7.66 8.95a1 1 0 0 1-.67-.01C7.5 20.5 4 18 4 13V6a1 1 0 0 1 1-1c2 0 4.5-1.2 6.24-2.72a1.17 1.17 0 0 1 1.52 0C14.51 3.81 17 5 19 5a1 1 0 0 1 1 1z"/></svg> </li>
                        <input type="color" class='colorInput' title="choose a color" value="#ff0000">
                </ul>   
                <ul class='buttons'>
                    <li class="download-btn tool-button" title="download"> <i class="fa fa-download" aria-hidden="true"></i> </li>
                    <div class="download-div">
                        <button class="download-custom download-800" data-width="800" data-height="600">Download 800 x 600 </button>
                        <button class="download-custom download-400" data-width="1600" data-height="1200">Download 1600 x 1200 </button>
                        <button class="download-custom download-og-btn">Download Original Size</button>
                    </div>
                </ul>
            </div>

            <div id="canvas-area" class="wpia-canvas-area">
                <img src="<?php echo $image; ?>" alt="<?php _e('Annotator preview image', 'image-annotator'); ?>" id="wpia-preview-image">
                    <canvas id="main-canvas"></canvas>
            </div>
            <img src="" id="testing-image">
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