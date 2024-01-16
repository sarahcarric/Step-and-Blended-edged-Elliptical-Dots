#version 120 
// you can set these uniform variables  dynamically or hardwire them:
uniform float uKa, uKd, uKs; // coefficients of each type of lighting
uniform float uShininess; // specular exponent

// these have to be set dynamically from glman sliders or keytime animations:
uniform float uAd, uBd;
uniform float uTol;

// in variables from the vertex shader:
varying vec2 vST; // texture cords
varying vec3 vN; // normal vector
varying vec3 vL; // vector from point to light
varying vec3 vE; // vector from point to eye
varying vec3 vMCposition;

void
main( )
{
	vec3 Normal = normalize(vN);
	vec3 Light = normalize(vL);
	vec3 Eye = normalize(vE);
	vec3 myColor = vec3(1.,0.,0.);		// whatever default color you'd like
	vec3 mySpecularColor = vec3(1.,0.,0.);	// whatever default color you'd like

	//set myColor by using the ellipse equation to create a smooth blend between the ellipse color and the background color
	//now use myColor in the lighting equations >>

	// here is the per-fragment lighting:
	vec3 ambient = uKa * myColor;
	float d = 0.;
	float s = 0.;
	if( dot(Normal,Light) > 0. ) // only do specular if the light can see the point
	{
		d = dot(Normal,Light);
		vec3 ref = normalize( reflect( -Light, Normal ) ); // reflection vector
		s = pow( max( dot(Eye,ref),0. ), uShininess );
	}
	vec3 diffuse =  uKd * d * myColor;
	vec3 specular = uKs * s * mySpecularColor;
	gl_FragColor = vec4( ambient + diffuse + specular, 1. );
}