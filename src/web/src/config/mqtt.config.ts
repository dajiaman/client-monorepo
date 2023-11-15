import { IClientOptions } from "mqtt";
import store2 from "store";
import { decryptByRSA } from "../utils/cryptoUtils";
import { my_private_key } from "./private_key";
import { buildSessionId } from "@/utils/buildSessionId";

/**
 * 获取mqttConfig
 * @returns
 */
function getMqttConfig() {
	const mqttConfig = store2.get("mqttConfig");

	const {
		mqtt_host,
		mqtt_username,
		mqtt_password,
		mqtt_topic_put,
		mqtt_topic_sub,
		mqtt_topic_version,
	} = mqttConfig;

	const de_mqtt_topic_put = decryptByRSA(
		my_private_key,
		mqtt_topic_put
	) as string;
	const de_mqtt_topic_sub = decryptByRSA(
		my_private_key,
		mqtt_topic_sub
	) as string;
	const de_mqtt_topic_version = decryptByRSA(
		my_private_key,
		mqtt_topic_version
	) as string;

	const [pcTopicPut, pcTopicGetReq] = de_mqtt_topic_sub.split(",");
	const [pcTopicPutReq, pcTopicGet] = de_mqtt_topic_put.split(",");

	// save in localStorage
	store2.set("pcTopicPutReq", pcTopicPutReq);
	store2.set("pcTopicGet", pcTopicGet);
	store2.set("pcTopicPut", pcTopicPut);
	store2.set("pcTopicGetReq", pcTopicGetReq);
	store2.set("pcAdminTopGetReq", "1/pc/admin/GET_REQ/+");

	if (!store2.get("global_clientId")) {
		store2.set("global_clientId", buildSessionId());
	}

	const globalClientId = store2.get("global_clientId");

	const MQTT_config = <IMqttConfig>{
		brokerUrl: decryptByRSA(my_private_key, mqtt_host) as string,
		opts: <IClientOptions>{
			username: decryptByRSA(my_private_key, mqtt_username) as string, //  连接用户名
			password: decryptByRSA(my_private_key, mqtt_password) as string, //  连接密码，有的密码默认public
			clientId: globalClientId, //  客户端ID
			keepalive: 10, // 心跳时间/秒。0：禁用     心跳时间间隔要小于超时时间
			protocolId: "MQTT",
			protocolVersion: 5,
			retain: false, //  重复收到消息
			clean: false, //  设置为false在offline时接收QoS 1和2消息，true:清除会话，false:保留会话
			resubscribe: false, //  如果连接断开并重新连接，则会再次自动订阅已订阅的主题（默认true）
			reconnectPeriod: 5 * 1000, //  毫秒，两次重连接的间隔时间
			connectTimeout: 30 * 1000, //  30 * 1000毫秒，接收到CONNACK之前的等待时间
			rejectUnauthorized: false, //  如果您使用的是自签名证书，请传递 rejectUnauthorized: false 选项。
		},
	};

	return MQTT_config;
}

export default getMqttConfig;

export interface IMqttConfig {
	brokerUrl: string;
	opts: IClientOptions;
}
