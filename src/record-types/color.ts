/** Highlight color foreground option */
export type option_color_foreground =
    | 'default'                                                 // Default
    | 'gray'                                                    // Gray
    | 'brown'                                                   // Brown
    | 'orange'                                                  // Orange
    | 'yellow'                                                  // Yellow
    | 'teal'                                                    // Teal / Green
    | 'blue'                                                    // Blue
    | 'purple'                                                  // Purple
    | 'pink'                                                    // Pink
    | 'red'                                                     // Red
    ;

/** Highlight color background option */
export type option_color_background =
    | 'default_background'                                      // Default background
    | 'gray_background'                                         // Gray background
    | 'brown_background'                                        // Brown background
    | 'orange_background'                                       // Orange background
    | 'yellow_background'                                       // Yellow background
    | 'teal_background'                                         // Teal / Green background
    | 'blue_background'                                         // Blue background
    | 'purple_background'                                       // Purple background
    | 'pink_background'                                         // Pink background
    | 'red_background'                                          // Red background
    ;

/** Highlight color option */
export type option_color = option_color_foreground | option_color_background;
