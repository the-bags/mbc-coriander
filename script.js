const AWS = require('aws-sdk');
AWS.config.update({ region: 'eu-west-2' });
const ec2 = new AWS.EC2();
const instanceParams = require('./instanceParams');

const createInstance = (params) => {
  return new Promise((resolve, reject) => {
    const instancePromise = ec2.runInstances(params).promise();
    instancePromise.then(data => resolve(data.Instances[0].InstanceId))
      .catch(err => reject(err));
  })
};

const getPublicIpById = (id) => {
  return new Promise((resolve, reject) => {
    ec2.describeInstances({ Filters: [{ Name: 'instance-id', Values: [id] }] }).promise()
      .then(data => resolve(data.Reservations[0].Instances[0].PublicIpAddress))
      .catch(err => reject(err))
  })
};

createInstance(instanceParams).then(instanceId => {
    getPublicIpById(instanceId).then(instanceIp =>
      console.log('Instance', instanceId, 'is successfully created. Access on IP:', instanceIp))
  }
);



