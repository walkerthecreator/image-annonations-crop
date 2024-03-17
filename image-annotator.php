<?php
/*
  Plugin Name: Image Annotator
  Description: Adds the ability to create annotated images and then edit the annotations later.
  Version: 1.0
  Author: Moe Loubani
  Author URI: http://www.moeloubani.com
  License: GPLv3
 */


//Add file for plugin setup (post type and script registration)
require('inc/class-wpia_admin.php');

//Adds image annotation area
require('inc/class-wpia_metaboxes.php');

//Adds front end functions like shortcodes and script registration
require('inc/class-wpia_front.php');

function my_plugin_enqueue_scripts() {
  // Enqueue main script
  wp_enqueue_script('my-plugin-script', plugins_url('admin/js/script.js', __FILE__), array(), '1.0', true);

  // Localize script with PHP variables
  wp_localize_script('my-plugin-script', 'my_plugin_vars', array(
      'icon1' => plugins_url('admin/assets/quality.png', __FILE__),
      'icon2' => plugins_url('admin/assets/safe.png', __FILE__),
      'icon3' => plugins_url('admin/assets/env.png', __FILE__),
      'icon4' => plugins_url('admin/assets/quality.png', __FILE__),
  ));
}

add_action('admin_enqueue_scripts', 'my_plugin_enqueue_scripts');



