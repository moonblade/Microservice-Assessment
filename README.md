# Watermark microservice project for assessment

Was given a freelancing oppurtunity which required experience in Kubernetes, Docker containers, CI/CD, and Microservices. Since my experience with all of them was pretty much zero, decided to create a project to learn them, and give as assessment.

The core of the project is simple enough. A document is provided by the user, another service takes the document, adds a watermark on the document and then rights it back to the db in an asynchronous manner.

The trick is to make each of these items into its own microservice. So in the final version, there were five microservices. Each microservice was wrapped in a Docker container. This entire assembly was supposed to be be pushed to a kubernetes cluster in GCP. But ended up starting the freelancing project, so abandoned it at this point. 

Got to learn docker and kubernetes, working with microservices, and grpc and pubsub for communication from this.

### [Changelog](https://github.com/moonblade/watermark/blob/master/ChangeLog.md)

### Services



1. **User interface**

  This one gives an api interface for the user to interact with the entire service.

 - `/watermark` Api to start the watermarking process. Inputs a document, gets a ticket back. Creates a pubsub status of created with ticket number once document is inserted. 
 - `/document` Api to get document, in its current state. Inputs a ticket, returns document.
 - `/status` Api to get status of watermarking the document given by ticket. Inputs a ticket. Returns completed or not. 

2. **Document service**

When a document is added, a grpc call is made to this service to add it in the db. 

3. **Worker** 

When pubsub event is received, worker directs watermarker to download the document, watermark it and reupload it  

4. **Watermarker**

Receive ticket, download document from docuemnt service, Add watermark and push it back.

5. **Status**

Receive ticket and returns the status of the document, whether it has been watermarked or not.

### Design

![v2.0](https://github.com/moonblade/watermark/raw/dev/assets/archv2.0.png)
