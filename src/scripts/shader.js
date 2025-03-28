const vert = `
 attribute vec3 aPosition;
 attribute vec2 aTexCoord;
 
 varying vec2 vTexCoord;
 
 void main() {
   vec4 positionVec4 = vec4(aPosition, 1.0);
   
   positionVec4.xy = positionVec4.xy * 2.0;
   
   vTexCoord = aTexCoord;
   
   gl_Position = positionVec4;
 }
 `;
 
 function frag(number) {
   return `precision mediump float;

varying vec2 vTexCoord;
uniform vec2 u_mouse;
uniform float u_time;

void main() {
    vec2 st = vTexCoord;

    vec3 color = vec3(.0);

    // Cell positions
    vec2 point[5];
    point[0] = vec2(0.83,0.75);
    point[1] = vec2(0.60,0.07);
    point[2] = vec2(0.28,0.64);
    point[3] =  vec2(0.31,0.26);
    point[4] = u_mouse;

    float m_dist = 1.;  // minimum distance

    // Iterate through the points positions
    for (int i = 0; i < 5; i++) {
        float dist = distance(st, point[i]);

        // Keep the closer distance
        m_dist = min(m_dist, dist);
    }

    // Draw the min distance (distance field)
    color += m_dist;

    // Show isolines
    // color -= step(.7,abs(sin(50.0*m_dist)))*.3;

    gl_FragColor = vec4(color, 1.0);
}
     `;
 }
 
 export { frag, vert };