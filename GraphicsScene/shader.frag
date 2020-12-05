//Classic Phong fragment shader
#version 410

in vec4 vPosition;
in vec3 vNormal;
in vec3 vTangent;
in vec3 vBiTangent;
in vec4 vColor;
in vec2 vTexCoord;

uniform vec3 Ka;
uniform vec3 Kd;
uniform vec3 Ks;
uniform float specularPower;

uniform vec3 Ia;
uniform vec3 Id;
uniform vec3 Is;
uniform vec3 LightDirection;

uniform vec3 CameraPosition;
uniform sampler2D DiffuseTex;
uniform sampler2D NormalTex;
uniform sampler2D SpecularTex;

out vec4 FragColor;

void main() {
	//Ensure normal and light direction are normalized
	vec3 N = normalize(vNormal);
	vec3 T = normalize(vTangent);
	vec3 B = normalize(vBiTangent);
	vec3 L = normalize(LightDirection);

	mat3 TBN = mat3(T, B, N);

	vec3 normalTex = texture ( NormalTex, vTexCoord ).rgb;
	vec3 specularTex = texture ( SpecularTex, vTexCoord ).rgb;
	vec3 diffuseTex = texture ( DiffuseTex, vTexCoord ).rgb;

	N = TBN * (normalTex * 2 - 1);

	//Calculate lambert term (negate light direction)
	float lambertTerm = max(0, min(1, dot(N, -L)));

	//Calculate view vector and reflection vector
	vec3 V = normalize(CameraPosition - vPosition.xyz);
	vec3 R = reflect(L, N);

	//Calculate specular term
	float specularTerm = pow(max(0, dot(R, V)), specularPower);

	//Output color
	vec3 ambient = (Ka + vColor.rgb) * Ia * normalTex;
	vec3 diffuse = (Kd + vColor.rgb) * Id * lambertTerm * diffuseTex;
	vec3 specular = (Ks + vColor.rgb) * Is * specularTerm * specularTex * specularPower;
	FragColor = vec4(ambient - diffuse + specular, 1);
}
