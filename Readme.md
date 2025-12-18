Youtube backend trial and still trying with java script



# Models -> Formed
## User.model & video.model

After that use or install mongoose-aggregate-paginate-v2  ---> this allows us to write aggregation qurries

we will use this in video.model

### Password Encryption

now we will look towards some packages --> bcrypt(A bcrypt library for NodeJs) and bcryptjs(Optimized bcrypt in plain with zero dependencies. Compatible to "bcrypt". Mostly used).
bcrypt => A library to help you hash password


For token we will use jsonwebtoken --> It used to encrypt the data

--> If you want that how tokens work then visit JWT.io


After all this we cannot encrypt data directly so we will use some hooks of middleware - Pre(just before saving the data we can run any code by using this - usually password encryption),



as we make middleware we can make methods  ref.- user.model


jwt == it is a bearer token,it means this acts like a key(lock)



## Cloudinary - Now we will look for this 

When we upload file you need two packages 
#### express-fileupload / Multer(mostly used)

installed multer and cloudinary 

so we will upload file by multer to cloudinary  


Now write the code for to upload file - ref.(cloudinary)


Now we will make middleware by using Multer


### Now configuration Setting is over


## Now we will write controller - logic understanding


## Creating Routes
After making methods -> To make it run -> hits by url -> for this we make routes



Now we will make/check user  