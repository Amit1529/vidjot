if(process.env.NODE_ENV==='production')
{
    module.exports={mongoURI:'mongodb://Amit:Amit@013@ds039155.mlab.com:39155/vidjot-prod'};
}

else
{
    module.exports={mongoURI:'mongodb://localhost/vidjot-dev'};
}