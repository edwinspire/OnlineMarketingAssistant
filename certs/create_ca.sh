#!/bin/sh

#https://dzone.com/articles/creating-self-signed-certificate

#Create RSA Private Key
# The below command will create a file named 'server.pass.key' and place it in the same folder where the command is executed. 
openssl genrsa -des3 -passout pass:ClaveAleatoriaAqui -out server.pass.key 2048

#The below command will use the 'server.pass.key' file that just generated and create 'server.key'.
openssl rsa -passin pass:ClaveAleatoriaAqui -in server.pass.key -out selfsigned.key

# We no longer need the 'server.pass.key'
rm server.pass.key

#Create the Certificate Signing Request (CSR), utilizing the RSA private key we generated in the last step.
# The below command will ask you for information that would be included in the certificate. Since this is a self-signed certificate, there is no need to provide the 'challenge password' (to leave it blank, press enter).
openssl req -new -key selfsigned.key -out server.csr
#Generate a file named v3.ext with the below-listed contents


#Create the SSL Certificate, utilizing the CSR created in the last step.
openssl x509 -req -sha256 -extfile v3.ext -days 730 -in server.csr -signkey selfsigned.key -out selfsigned.crt


