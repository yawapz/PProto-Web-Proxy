# Демонстрационный проект с примерами использования протокола [PProto](https://github.com/hkarel/PProtoCpp) для WEB

Проект содержит: 

- [Proxy-сервис](https://github.com/hkarel/PProtoDemoWeb/tree/master/proxy) для взаимодействия с целевым сервисом через протокол [PProto](https://github.com/hkarel/PProtoCpp);
- Примеры web-клиентов, которые подключаются к Proxy-сервису через WebSocket: 
  - [example-1](https://github.com/hkarel/PProtoDemoWeb/tree/master/example-1) Простейший пример на чистом JavaScript;
  - [example-2](https://github.com/hkarel/PProtoDemoWeb/tree/master/example-2) Пример на ReactJS.

Тестовая реализация целевого сервиса на C++ находится в проекте [PProtoDemo](https://github.com/hkarel/PProtoDemo), см. пример [WDemo 01 Server](https://github.com/hkarel/PProtoDemo/tree/master/src/demo/web/wdemo01_server).
