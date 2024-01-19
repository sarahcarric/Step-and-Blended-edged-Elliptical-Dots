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
uniform vec3    uColor;	

void
main( )
{
	
	vec3 Normal = normalize(vN);
	vec3 Light = normalize(vL);
	vec3 Eye = normalize(vE);
	
	vec3 myColor=vec3(1.,1.0,1.0);
	vec3 mySpecularColor = vec3(0.,0.,0.);	// whatever default color you'd like
	float Ar = uAd/2.;
	float Br = uBd/2.;
	int numins = int( vST.s / uAd ); 
	int numint = int( vST.t / uBd ); 
	float sc = numins *uAd + Ar; 
	float tc = numint *uBd + Br;

	//set myColor by using the ellipse equation to create a smooth blend between the ellipse color and the background color
	//now use myColor in the lighting equations 
	if(((vST.s-sc)/Ar)*((vST.s-sc)/Ar)+((vST.t-tc)/Br)*(((vST.t-tc)/Br))<=1.0)
	{
		
		myColor = vec3( 1., 0.25, 1. );
	}
	else{
		myColor= vec3(0.25,1.,1.);
		}
	

	
	// here is the per-fragment lighting:
	vec3 ambient = uKa * myColor;
	float d = 0.;
	float e = 0.;
	if( dot(Normal,Light) > 0. ) // only do specular if the light can see the point
	{
		d = dot(Normal,Light);
		vec3 ref = normalize( reflect( -Light, Normal ) ); // reflection vector
		e = pow( max( dot(Eye,ref),0. ), uShininess );
	}
	vec3 diffuse =  uKd * d * myColor;
	vec3 specular = uKs * e * mySpecularColor;
	gl_FragColor = vec4( ambient + diffuse + specular, 1. );
}