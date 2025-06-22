// src/components/BioDigitalViewer.js
import { useEffect } from 'react';

export default function BioDigitalViewer() {
  useEffect(() => {
    const interval = setInterval(async () => {
      try {
        const response = await fetch('http://127.0.0.1:5050/latest-object');
        const data = await response.json();

        if (data.objectId && window.lastSeenObjId !== data.objectId) {
          window.lastSeenObjId = data.objectId;

          window.human.send('camera.set', { objectId: data.objectId, animate: true });
          const selectObjects = { replace: true };
          selectObjects[data.objectId] = true;
          window.human.send('scene.selectObjects', selectObjects);
        }
      } catch (err) {
        console.error('Polling failed:', err);
      }
    }, 2000);

    window.human = new window.HumanAPI('myWidget');
    const hiddenObjectIDs = new Set();
    const objectID = [];
    const objectName = [];

    window.human.on('human.ready', function () {
      window.human.send('ui.setDisplay', { all: false });
      window.human.send('ui.setBackground', { colors: [' black'] });

      function orbitContinuously() {
        window.human.send('camera.orbit', { yaw: 0.2 });
        requestAnimationFrame(orbitContinuously);
      }
      
      orbitContinuously();
      

      const systemsToHide = [
        'Reproductive System',
        'Urinary System',
        'Cardiovascular System',
        'Nervous System'
      ];
      const hideMap = {};

      window.human.send('scene.getLayers', (layers) => {
        layers[0].forEach((layer) => {
          if (systemsToHide.includes(layer.name.trim())) {
            layer.objectIds.forEach((id) => {
              hideMap[id] = false;
              hiddenObjectIDs.add(id);
            });
          }
        });

        window.human.send('scene.showObjects', hideMap);

        setTimeout(() => {
          window.human.send('scene.info', (data) => {
            const sceneObjects = data.objects;
            for (let objectId in sceneObjects) {
              if (!hiddenObjectIDs.has(objectId)) {
                objectID.push(objectId);
                objectName.push(sceneObjects[objectId].name);
              }
            }
                
            console.log(
              JSON.stringify(
                objectID.map((id, i) => ({ objectId: id, name: objectName[i] })),
                null,
                2
              )
            );
          });
        }, 500);
      });
    });

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="anatomy-container">
      <iframe
        id="myWidget"
        className="anatomy-viewer"
        src="https://human.biodigital.com/widget/?be=6CbU&dk=9ab830f0b982c722b472f87e607ec88ca8eb754d"
      ></iframe>
    </div>



  );
} 