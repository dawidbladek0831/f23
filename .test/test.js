import http from 'k6/http';
import { check, sleep } from 'k6';

export let options = {
    vus: 7000,
    duration: '5m'
};

const gus = 65;
const baseUrl = 'http://localhost:9023/api/v1';
const token = ""
const presences = ["ONLINE", "IDLE", "OFFLINE"];
const domainObjectType = 'CHANNEL';

function getUserId(number){
    return `user-${number}`;
}
function getUserGroupId(number){
    let n = Math.floor(options.vus/gus);
    return `group-${Math.floor(number/n)}`;
}
function addToGroup(userId, groupId) {
    let payload = JSON.stringify({ domainObjectType: domainObjectType, domainObjectId: groupId, userId: userId });
    let addRes = http.put(
        `${baseUrl}/group-members`,
        payload,
        {
            headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json'
            }
        }
    );
    check(addRes, { 'added to group': (r) => r.status === 200 || r.status === 204 });
}

function sendHeartbeat(userId) {
    let r = Math.floor(Math.random() * presences.length);
    let heartbeatPayload = JSON.stringify({ userId: userId, presence: presences[r] });

    let putRes = http.put(`${baseUrl}/heartbeats`, heartbeatPayload, {
        headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
        }
    });
    check(putRes, { 'heartbeat status 204': (r) => r.status === 204 });
}

function exampleRequest(userId) {
    let getRes = http.get(`${baseUrl}/statuses/${userId}`, {
        headers: { 'Authorization': `Bearer ${token}` }
    });
    check(getRes, { 'status 200': (r) => r.status === 200 });
}

function runOnceEvery(n, f, args) {
    if (Math.random() < 1/n) {
        f.apply(null, args);
    }
}

function connectSSE(userId) {
    let res = http.get(`${baseUrl}/event-streams/${userId}`, {
        headers: {
            'Authorization': `Bearer ${token}`,
            'Accept': 'text/event-stream'
        },
        timeout: '10s' 
    });
    console.log(`SSE for ${userId}: ${res.body}`);
}

function subscripe(userId, groupId) {
    let payload = JSON.stringify({ domainObjectType: domainObjectType, domainObjectId: groupId, userId: userId });

    let res = http.patch(`${baseUrl}/event-streams/${userId}/subscriptions`, payload, {
        headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
        }
    });
    check(res, { 'subscription status 200': (r) => r.status === 200 });
}

export default function () {
    let userId = getUserId(__VU - 1);

    if (__ITER == 0) {
        addToGroup(userId, getUserGroupId(__VU));
        // connectSSE(userId);
        // subscripe(userId, getUserGroupId(__VU));
        sleep(30);
    }
    sendHeartbeat(userId);
    exampleRequest(userId);

    sleep(30);
}
