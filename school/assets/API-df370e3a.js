import{S as i,e as S}from"./_plugin-vue_export-helper-0759fc3c.js";let _=null;const u={container:_},B={forMaterial(t,e){if(!e||!t)return!1;Array.isArray(t)?t.forEach(o=>{e(o)}):e(t)}},O={surroundLineGeometry(t){return new Bol3D.EdgesGeometry(t.geometry)}},V={peilou:{time:{value:0},isStart:!1,StartTime:{value:0},surroundLineMaterial:null,flyData:[{source:{x:-200,y:0,z:500},target:{x:-200,y:400,z:500},range:150,height:230,color:"#65cbe3",frequency:3.4,size:10}],setCityMaterial(t){t.geometry.computeBoundingBox(),t.geometry.computeBoundingSphere();const{geometry:e}=t,{center:o,radius:n}=e.boundingSphere,{max:s,min:r}=e.boundingBox,a=new Bol3D.Vector3(s.x-r.x,s.y-r.y,s.z-r.z);B.forMaterial(t.material,c=>{c.opacity=.68,c.transparent=!0,c.onBeforeCompile=l=>{l.uniforms.time=this.time,l.uniforms.uStartTime=this.StartTime,l.uniforms.uCenter={value:o},l.uniforms.uSize={value:a},l.uniforms.uMax={value:s},l.uniforms.uMin={value:r},l.uniforms.uTopColor={value:new Bol3D.Color("#001c38")},l.uniforms.uSwitch={value:new Bol3D.Vector3(0,0,0)},l.uniforms.uDiffusion={value:new Bol3D.Vector3(0,1e3,120)},l.uniforms.uDiffusionCenter={value:new Bol3D.Vector3(0,0,0)},l.uniforms.uFlow={value:new Bol3D.Vector3(1,30,10)},l.uniforms.uColor={value:new Bol3D.Color("#5588aa")},l.uniforms.uFlowColor={value:new Bol3D.Color("#63c9e1")},l.uniforms.uOpacity={value:1},l.uniforms.uRadius={value:n},l.uniforms.uModRange={value:10},l.uniforms.uModWidth={value:1.5};const f=`

            float distanceTo(vec2 src, vec2 dst) {
              float dx = src.x - dst.x;
              float dy = src.y - dst.y;
              float dv = dx * dx + dy * dy;
              return sqrt(dv);
            }
  
            float lerp(float x, float y, float t) {
              return (1.0 - t) * x + t * y;
            }
  
            vec3 getGradientColor(vec3 color1, vec3 color2, float index) {
              float r = lerp(color1.r, color2.r, index);
              float g = lerp(color1.g, color2.g, index);
              float b = lerp(color1.b, color2.b, index);
              return vec3(r, g, b);
            }
  
  
            varying vec4 vPositionMatrix;
            varying vec3 vPosition;
  
            uniform float time;
            // 扩散参数
            uniform float uRadius;
            uniform float uOpacity;
            uniform float uModRange;
            uniform float uModWidth;
            // 初始动画参数
            uniform float uStartTime; 
  
            uniform vec3 uMin;
            uniform vec3 uMax;
            uniform vec3 uSize;
            uniform vec3 uFlow;
            uniform vec3 uColor;
            uniform vec3 uCenter;
            uniform vec3 uSwitch;
            uniform vec3 uTopColor;
            uniform vec3 uFlowColor;
            uniform vec3 uDiffusion; 
            uniform vec3 uDiffusionCenter;
  
  
            void main() {
          `,p=`
            vec3 distColor = outgoingLight;
            float dstOpacity = diffuseColor.a;
  
            float indexMix = vPosition.y / (uSize.y * 0.6);
            distColor = mix(distColor, uTopColor, indexMix);

            // 开启扩散波
            vec2 position2D = vec2(vPosition.x, vPosition.z);
            float mx = mod(vPosition.x, uModRange);
            float my = mod(vPosition.y, uModRange);
            float mz = mod(vPosition.z, uModRange);
          
            if (uDiffusion.x > 0.5) {
              // 扩散速度
              float dTime = mod(time * uDiffusion.y, uRadius * 2.0);
              // 当前的离中心点距离
              float uLen = distanceTo(position2D, vec2(uCenter.x, uCenter.y));
      
              // 扩散范围
              if (uLen < dTime && uLen > dTime - uDiffusion.z) {
                // 颜色渐变
                float dIndex = sin((dTime - uLen) / uDiffusion.z * PI);
                distColor = mix(uColor, distColor, 1.0 - dIndex);
              }
      
              // 扫描中间格子
              // if (uLen < dTime) {
              //   if (mx < uModWidth || my < uModWidth || mz < uModWidth ) {
              //     distColor = vec3(0.7);
              //   }
              // }
            }
         
            // 流动效果{
            float dTime = mod(time * uFlow.y, uSize.y); 
            // 流动范围
            float topY = vPosition.y + uFlow.z;
            if (dTime > vPosition.y && dTime < topY) {
              // 颜色渐变 
              float dIndex = sin((topY - dTime) / uFlow.z * PI);
              distColor = mix(distColor, uFlowColor,  dIndex); 
            }
            gl_FragColor = vec4(distColor, dstOpacity * uStartTime);
            #include <logdepthbuf_fragment>
            #include <tonemapping_fragment>
          `;l.fragmentShader=l.fragmentShader.replace("void main() {",f),l.fragmentShader=l.fragmentShader.replace("gl_FragColor = vec4( outgoingLight, diffuseColor.a );",p);const y=`
            varying vec4 vPositionMatrix;
            varying vec3 vPosition;
            uniform float uStartTime;
            void main() {
              vPositionMatrix = projectionMatrix *  vec4(position, 1.0);
              vPosition = position;
          `,d=`
            vec3 transformed = vec3(position.x, position.y * uStartTime, position.z);
          `;l.vertexShader=l.vertexShader.replace("void main() {",y),l.vertexShader=l.vertexShader.replace(`#include <begin_vertex>
#include <logdepthbuf_vertex>`,d)}})},surroundLine(t){const e=O.surroundLineGeometry(t),o=new Bol3D.Vector3;t.getWorldPosition(o);const{max:n,min:s}=t.geometry.boundingBox,r=new Bol3D.Vector3(n.x-s.x,n.y-s.y,n.z-s.z),a=this.createSurroundLineMaterial({max:n,min:s,size:r}),c=new Bol3D.LineSegments(e,a);c.name="surroundLine",c.scale.copy(t.scale),c.rotation.copy(t.rotation),c.position.copy(o),i.sceneList.peilouLine=c,i.bloomList.push(c),u.container.attach(i.sceneList.peilouLine)},surroundLineShader:{vertexShader:`
        #include <logdepthbuf_pars_vertex>
        #include <common>
    
        uniform mediump float uStartTime;
        uniform mediump float time;
        uniform mediump float uRange;
        uniform mediump float uSpeed;
    
        uniform vec3 uColor;
        uniform vec3 uActive;
        uniform vec3 uMin;
        uniform vec3 uMax;
    
        varying vec3 vColor;
    
        float lerp(float x, float y, float t) {
          return (1.0 - t) * x + t * y;
        }

        void main() { 
          if (uStartTime >= 0.99) {
            float iTime = mod(time * uSpeed - uStartTime, 1.0);
            float rangeY = lerp(uMin.z, uMax.z, iTime);
            if (rangeY < position.z && rangeY > position.z - uRange) {
              float index = 1.0 - sin((position.z - rangeY) / uRange * PI);
              float r = lerp(uActive.r, uColor.r, index);
              float g = lerp(uActive.g, uColor.g, index);
              float b = lerp(uActive.b, uColor.b, index);

              vColor = vec3(r, g, b);
            } else {
              vColor = uColor;
            }
          }
          vec3 vPosition = vec3(position.x, position.y * uStartTime, position.z);
          gl_Position = projectionMatrix * modelViewMatrix * vec4(vPosition, 1.0);
          #include <logdepthbuf_vertex>
        } 
      `,fragmentShader:` 
        #include <logdepthbuf_pars_fragment>
        #include <common>
        precision mediump float;

        float distanceTo(vec2 src, vec2 dst) {
          float dx = src.x - dst.x;
          float dy = src.y - dst.y;
          float dv = dx * dx + dy * dy;
          return sqrt(dv);
        } 

        float lerp(float x, float y, float t) {
          return (1.0 - t) * x + t * y;
        }

        uniform float time;
        uniform float uOpacity;
        uniform float uStartTime;

        varying vec3 vColor; 

        void main() {

          gl_FragColor = vec4(vColor, uOpacity * uStartTime);

          

          #include <logdepthbuf_fragment>
        }
      `},flyShader(t){const{source:e,target:o,height:n,size:s,color:r,range:a,frequency:c}=t,l=[],f=[],p=[],y=[],d=new Bol3D.Vector3(e.x,e.y,e.z),x=new Bol3D.Vector3(o.x,o.y,o.z),m=x.clone().lerp(d,.5);m.y+=n;const b=parseInt(d.distanceTo(m)+x.distanceTo(m));new Bol3D.QuadraticBezierCurve3(d,m,x).getPoints(b).forEach((v,T)=>{const N=T/(b-1);l.push({x:v.x,y:v.y,z:v.z}),p.push(N),y.push(T)}),l.forEach(v=>{f.push(v.x,v.y,v.z)});const L=new Bol3D.BufferGeometry,I=[0,0,0,-6.060236027763116,2.5180602303964132,.6121045337085322,-12.238510332152941,5.07151121530701,1.2479290627650976,-18.5311722448202,7.659258395313825,1.9067399790661483,-24.93457109741561,10.280207210998892,2.5878036745081374,-31.445056221589894,12.933263102944252,3.2903865409875173,-38.05897694899377,15.617331511731935,4.01375497040074,-44.772682611277965,18.33131787794398,4.75717535464426,-51.58252254009317,21.074127642162424,5.519914085614527,-58.48484606709015,23.844666244969297,6.301237555207995,-65.47600252391959,26.64183912694664,7.100412155321118,-72.55234124223223,29.464551728676483,7.916704277850347,-79.71021155367879,32.31170949074087,8.749380314692132,-86.94596278990998,35.18221785372182,9.597706657742934,-94.25594428257654,38.074982258201395,10.460949698899196,-101.63650536332914,40.98890814476161,11.338375830057375,-109.08399536381856,43.922900953984495,12.229251443113924,-116.5947636156955,46.87586612645211,13.132842929965298,-124.16515945061066,49.84670910274648,14.04841668250794,-131.79153220021476,52.83433532344963,14.975239092638313,-139.47023119615855,55.837650229143605,15.912576552252863,-147.19760577009276,58.85555926041043,16.859695453248047,-154.97000525366806,61.88696785783217,17.815862187520317,-162.78377897853522,64.93078146199083,18.780343146966125,-170.6352762763449,67.98590551346845,19.752404723481916,-178.5208464787479,71.05124545284708,20.731313308964154,-186.43683891739488,74.12570672070875,21.716335295309293,-194.37960292393657,77.20819475763547,22.706737074413777,-202.34548783002373,80.29761500420932,23.701785038174055,-210.33084296730698,83.3928729010123,24.700745578486586,-218.33201766743716,86.49287388862646,25.70288508724783,-226.34536126206493,89.59652340763385,26.707469956354227,-234.36722308284104,92.70272689861648,27.713766577702234,-242.39395246141618,95.8103898021564,28.721041343188304,-250.4218987294411,98.91841755883563,29.728560644708896,-258.4474112185664,102.02571560923623,30.73559087416045,-266.466839260443,105.13118939394022,31.741398423439424,-274.4765321867215,108.23374435352963,32.74524968444227,-282.4728393290526,111.33228592858651,33.74641104906546,-290.4521100190871,114.4257195596929,34.74414890920541,-298.41069358847574,117.51295068743082,35.737729656758596,-306.344939368869,120.5928847523823,36.72641968362146,-314.251196691918,123.66442719512938,37.70948538169047,-322.1258148892731,126.72648345625413,38.68619314286207,-329.9651432925852,129.77795897633854,39.6558093590327,-337.765531233505,132.81775919596464,40.61760042209884,-345.5233280436832,135.84478955571453,41.57083272395692,-353.23488305477053,138.85795549617018,42.514772656503396,-360.8965455984176,141.85616245791365,43.44868661163473,-368.5046650062754,144.83831588152697,44.37184098124736,-376.0555906099944,147.8033212075922,45.28350215723775,-383.5456717412254,150.75008387669135,46.18293653150235,-390.9712577316191,153.67750932940646,47.06941049593762,-398.3286979128263,156.58450300631955,47.94219044244,-405.61434161649765,159.4699703480127,48.800542762905955,-412.82453817428393,162.33281679506788,49.64373384923192,-419.9556369178358,165.1719477880672,50.471030093314354,-427.00398717880387,167.98626876759266,51.28169788704971,-433.9659382888391,170.7746851742263,52.07500362233446,-440.837839579592,173.53610244855014,52.85021369106502,-447.61604038271355,176.26942603114622,53.60659448513789,-454.29689002985424,178.97356136259657,54.34341239644947,-460.87673785266475,181.64741388348327,55.05993381689626,-467.3519331827961,184.2898890343883,55.755425138374676,-473.71882535189866,186.89989225589372,56.4291527527812,-479.9737636916233,189.47632898858157,57.08038305201226,-486.11309753362093,192.01810467303386,57.70838242796432,-492.13317620954183,194.52412474983268,58.312417272533835,-498.0303490510372,196.99329465956,58.89175397761724,-503.8009653897574,199.42451984279796,59.445658935111005,-509.44137455735347,201.8167057401284,59.97339853691161,-514.9479258854757,204.16875779213353,60.47423917491543,-520.3169687057753,206.47958143939542,60.947447241018985,-525.5448523499025,208.7480821224959,61.39228912711871,-530.6279261495085,210.9731652820172,61.80803122511105,-535.5625394362437,213.1537363585412,62.193939926892476,-540.3450415417587,215.28870079265005,62.54928162435942,-544.9717817977048,217.37696402492583,62.87332270940833,-549.4391095357321,219.41743149595044,63.165329573935686,-553.7433740874918,221.40900864630592,63.424568609837905,-557.8809247846343,223.35060091657445,63.65030620901146,-561.8481109588104,225.24111374733786,63.8418087633528,-565.6412819416707,227.0794525791784,63.9983426647584,-569.2567870648663,228.86452285267794,64.1191743051247,-572.6909756600475,230.59523000841858,64.20357007634809,-575.9401970588651,232.27047948698242,64.25079637032513,-579.0008005929701,233.88917672895144,64.26011957895221,-581.8691355940128,235.45022717490758,64.23080609412578,-584.5415513936446,236.95253626543303,64.16212230774232,-587.0143973235154,238.39500944110972,64.05333461169826,-589.2840227152764,239.77655214251973,63.90370939789007,-591.3467769005781,241.09606981024515,63.712513058214185,-593.1990092110715,242.35246788486788,63.47901198456708,-594.8370689784072,243.54465180697005,63.20247256884515,-596.2573055342359,244.67152701713366,62.88216120294493,-597.456068210208,245.73199895594075,62.51734427876285,-598.4297063379745,246.72497306397344,62.107288188195284,-599.1745692491864,247.64935478181366,61.6512593231388,-599.6870062754942,248.50404955004345,61.148524075489775,-599.9633667485485,249.28796280924487,60.5983488371447,-600,250,60,-599.7568303712961,250.70575719261313,59.27836775637847,-599.2179163117903,251.3228429910941,58.49730515911822,-598.3877615437788,251.85260772124184,57.65771723898532,-597.2708697895583,252.29640170885534,56.76050902674583,-595.8717447714251,252.6555752797335,55.806585553165846,-594.194890211676,252.9314787596754,54.79685184901142,-592.2448098326072,253.12546247447992,53.73221294504864,-590.026007356515,253.23887674994606,52.61357387204357,-587.5429865056964,253.27307191187276,51.44183966076227,-584.8002510024475,253.22939828605902,50.21791534197082,-581.8023045690649,253.1092061983038,48.942705946435304,-578.553650927845,252.9138459744061,47.61711650492178,-575.0587938010843,252.64466794016482,46.24205204819636,-571.3222369110794,252.30302242137896,44.818417607025054,-567.3484839801265,251.8902597438475,43.34711821217395,-563.1420387305224,251.40773023336942,41.829058894409144,-558.7074048845633,250.85678421574363,40.26514468449668,-554.0490861645461,250.23877201676913,38.656280613202654,-549.1715862927666,249.5550439622449,37.00337171129313,-544.0794089915219,248.80695037796986,35.307323009534166,-538.7770579831083,247.995841589743,33.569039538691854,-533.2690369898221,247.12306792336332,31.789426329532255,-527.5598497339599,246.18997970462976,29.969388412821452,-521.6539999378183,245.1979272593413,28.1098308193255,-515.5559913236937,244.14826091329698,26.211658579810475,-509.2703276138823,243.0423309922956,24.275776725042462,-502.80151253068084,241.88148782213622,22.30309028578753,-496.1540497963859,240.6670817286178,20.294504292811734,-489.33244313329374,239.4004630375393,18.250923776881155,-482.341196263701,238.08298207469974,16.173253768761878,-475.184812909904,236.715989165898,14.062399299219962,-467.8677967941994,235.3008346369331,11.919265399021473,-460.3946516388835,233.83886881360408,9.7447570989325,-452.7698811662528,232.33144202170976,7.539779429719099,-444.9979890986039,230.77990458704915,5.305237422147357,-437.0834791582332,229.18560683542125,3.042036106983331,-429.03085506743724,227.54989909262503,.7510805149931059,-420.8446205485126,225.87413168445948,-1.56672432305721,-412.5292793237554,224.1596549367235,-3.9104733764016384,-404.0893351154623,222.4078191752161,-6.279261614274041,-395.52929164592973,220.61997472573623,-8.672184005908383,-386.85365263745445,218.79747191408285,-11.088335520538555,-378.06692181233257,216.94166106605493,-13.526811127398503,-369.17360289286074,215.05389250745148,-15.986705795722164,-360.1781996013354,213.13551656407148,-18.46711449474344,-351.08521566005305,211.18788356171382,-20.96713219369628,-341.89915479131025,209.21234382617746,-23.48585386181462,-332.62452071740324,207.21024768326143,-26.022374468332348,-323.26581716062884,205.1829454587647,-28.575788982483434,-313.8275478432831,203.13178747848616,-31.145192373501793,-304.31421648766303,201.05812406822486,-33.72967961062134,-294.7303268160645,198.9633055537798,-36.328345663076036,-285.08038255078446,196.84868226094986,-38.940285500099755,-275.3688874141193,194.71560451553398,-41.56459409092648,-265.60034512836523,192.5654226433312,-44.20036640479012,-255.77925941581913,190.3994869701405,-46.84669741092458,-245.91013399877707,188.21914782176074,-49.502682078563815,-235.9974725995359,186.025755523991,-52.16741537694173,-226.04577894039176,183.82066040263024,-54.8399922752923,-216.05955674364137,181.60521278347736,-57.5195077428494,-206.0433097315812,179.38076299233137,-60.20505674884697,-196.0015416265075,177.1486613549913,-62.89573426251897,-185.93875615071732,174.91025819725598,-65.59063525309924,-175.85945702650636,172.66690384492455,-68.28885468982182,-165.7681479761716,170.41994862379576,-70.98948754192062,-155.66933272200922,168.17074285966868,-73.69162877862951,-145.5675149863158,165.92063687834235,-76.39437336918249,-135.46719849138802,163.67098100561563,-79.09681628281339,-125.37288695952219,161.42312556728754,-81.79805248875624,-115.28908411301478,159.17842088915702,-84.49717695624491,-105.22029367416229,156.9382172970231,-87.1932846545133,-95.17101936526126,154.70386511668477,-89.88547055279543,-85.1457649086081,152.47671467394085,-92.57282962032511,-75.14903402649912,150.25811629459037,-95.25445682633642,-65.18533044123126,148.04942030443237,-97.92944714006317,-55.259157875100584,145.85197702926573,-100.5968955307393,-45.37502005040369,143.66713679488947,-103.25589696759879,-35.53742068943694,141.49624992710247,-105.9055464198755,-25.75086351449704,139.34066675170382,-108.54493885680344,-16.019852247880408,137.2017375944924,-111.17316924761649,-6.348890611883462,135.08081278126733,-113.78933256154853,3.257517671197263,132.97924263782738,-116.39252376783358,12.794868879065291,130.8983774899716,-118.98183783570549,22.258659289424372,128.8395676634989,-121.55636973439827,31.64438517997786,126.80416348420835,-124.1152144331458,40.947542828429164,124.79351527789888,-126.657466901182,50.163628512481864,122.80897337036944,-129.1822221077408,59.28813850983937,120.85188808741901,-131.6885750220561,68.31656909820526,118.92360975484658,-134.1756206133619,77.24441655528358,117.02548869845103,-136.64245385089208,86.0671771587771,115.15887524403144,-139.08816970388062,94.7803471863898,113.32511971738668,-141.51186314156138,103.37942291582533,111.52557244431574,-143.9126291331683,111.85990062478652,109.7615837506176,-146.28956264793544,120.21727659097758,108.03450396209124,-148.64175865509654,128.4470470921018,106.34568340453566,-150.96831212388557,136.54470840586248,104.69647240374977,-153.2683180235365,144.50575680996326,103.08822128553257,-155.54087132328326,152.32568858210823,101.52228037568295,-157.7850669923598,160,100,-160];L.setAttribute("position",new Bol3D.Float32BufferAttribute(I,3)),L.setAttribute("index",new Bol3D.Float32BufferAttribute(p,1)),L.setAttribute("current",new Bol3D.Float32BufferAttribute(y,1));const F=new Bol3D.ShaderMaterial({transparent:!0,depthWrite:!1,depthTest:!1,blending:Bol3D.AdditiveBlending,uniforms:{totalTime:this.time,uColor:{value:new Bol3D.Color(r)},uRange:{value:a||100},uSize:{value:s},uTotal:{value:b},uFrequency:{value:c},time:{value:0}},vertexShader:`
          attribute float index;
          attribute float current;
          uniform float time;
          uniform float uSize;
          uniform float uRange; // 展示区间
          uniform float uTotal; // 粒子总数
          uniform float totalTime; // 总经过时间
          uniform float uFrequency;
          uniform vec3 uColor; 
          varying vec3 vColor;
          varying float vOpacity;
          void main() {
            // 需要当前显示的索引
            float size = uSize;
            float showNumber = uTotal * mod(time, 2.0);


            if (showNumber > current && showNumber < current + uRange) {
              float uIndex = ((current + uRange) - showNumber) / uRange;
              size *= uIndex;
              vOpacity = 1.0;
            } else {
              vOpacity = 0.0;
            }


            // 顶点着色器计算后的Position
            vColor = uColor;
            vec4 mvPosition = modelViewMatrix * vec4(position, 1.0);
            gl_Position = projectionMatrix * mvPosition; 
            // 大小
            gl_PointSize = size * 300.0 / (-mvPosition.z);
          }`,fragmentShader:`
          varying vec3 vColor; 
          varying float vOpacity;
          void main() {
            gl_FragColor = vec4(vColor, vOpacity);
        }`});return new Bol3D.Points(L,F)},createSurroundLineMaterial({max:t,min:e,size:o}){return this.surroundLineMaterial?this.surroundLineMaterial:(this.surroundLineMaterial=new Bol3D.ShaderMaterial({alphaToCoverage:!0,transparent:!0,uniforms:{uColor:{value:new Bol3D.Color("#14324c")},uActive:{value:new Bol3D.Color("#7797a3")},time:this.time,uOpacity:{value:.6},uMax:{value:t},uMin:{value:e},uRange:{value:200},uSpeed:{value:.2},uStartTime:this.StartTime},vertexShader:this.surroundLineShader.vertexShader,fragmentShader:this.surroundLineShader.fragmentShader}),this.surroundLineMaterial)},initShader:function(){this.isStart=!0;const t=i.sceneList.peilou.children[0];this.setCityMaterial(t),this.surroundLine(t)},shaderAnimate:function(t){if(t>1)return!1;this.time.value+=t,this.isStart&&(this.StartTime.value+=t*.5,this.StartTime.value>=1&&(this.StartTime.value=1,this.isStart=!1))}},school:{time:{value:0},size:{x:{value:0},y:{value:0},z:{value:0}},UscaleY:{value:8},setMaterial(t){t.geometry.computeBoundingBox(),t.geometry.computeBoundingSphere();const{geometry:e}=t,{max:o,min:n}=e.boundingBox,s=new Bol3D.Vector3(o.x-n.x,o.y-n.y,o.z-n.z);this.size.x.value=s.x,this.size.y.value=s.y,this.size.z.value=s.z,B.forMaterial(t.material,r=>{r.transparent=!0,r.side=2,r.alphaToCoverage=!0,r.onBeforeCompile=a=>{a.uniforms.time=this.time,a.uniforms.x0=this.size.x,a.uniforms.y0=this.size.y,a.uniforms.z0=this.size.z;const c=`
            uniform float time;
            uniform float x0;
            uniform float y0;
            uniform float z0;
            uniform float UscaleY;
            // utime 用 THREE.clock()  render里复制
    
            varying vec3 vPosition;
            float x;
            float y;
            float z;
    
    
            // COLOR section
            vec3 baseTop = vec3(20., 29., 57.) / 255.;
            vec3 baseDown = vec3(102., 205., 228.) / 255.;
            vec3 lineCol = vec3(255., 130., 2.) / 255.;
    
            // GRAPH section
            int n = 5; //number of lines
            float scl = 2.; //difference between thin and thick lines
            float speed = 1.;
    
            float pi = 3.14;
  
            void main() {
          `,l=`
            x = vPosition.x / x0 + 0.5;  // 要除以模型的xyz  +0.5是让坐标系变为0-1
            y = vPosition.y / (y0 + UscaleY) + 0.5;  // 要除以模型的xyz  +0.5是让坐标系变为0-1
            z = vPosition.z / z0 + 0.5;  // 要除以模型的xyz  +0.5是让坐标系变为0-1

            // 要把uv转为position

            vec2 uv = vec2 (x, y);
            vec3 baseCol = mix(baseDown, baseTop, smoothstep(-0.2, 1., uv.y));


            float off = fract(time*speed);

            float lg = fract((exp(scl*uv.y)-1.) / (exp(scl)-1.) * float(n) - off);
            float mask = distance(lg, 0.5)*2.;

            vec3 col = mix(baseCol, lineCol, smoothstep(0.8, .9, mask)) ;

            gl_FragColor = vec4(col, 1.1 - y);
            #include <logdepthbuf_fragment>
          `;a.fragmentShader=a.fragmentShader.replace("void main() {",c),a.fragmentShader=a.fragmentShader.replace("gl_FragColor = vec4( outgoingLight, diffuseColor.a );",l);const f=`
            uniform float time;
            varying vec3 vColor;
            varying vec3 vPosition;
    
            
            void main() { 
              vPosition = vec3 (position.x, position.y, position.z);
          `,p=`
            vec3 transformed = vec3(vPosition);
          `;a.vertexShader=a.vertexShader.replace("void main() {",f),a.vertexShader=a.vertexShader.replace("#include <begin_vertex>",p)}})},initShader:function(t){this.setMaterial(t)},shaderAnimate:function(t){this.time.value=t}}};function g({cameraState:t,callback:e,delayTime:o=0,duration:n=800}){const s=new Bol3D.Vector3,r=new Bol3D.Vector3;if(s.set(t.target.x,t.target.y,t.target.z),r.set(t.position.x,t.position.y,t.position.z),s.distanceTo(u.container.orbitControls.target)<.1&&r.distanceTo(u.container.orbitControls.object.position)<.1){e&&e();return}if(i.isAnimating)return;i.isAnimating=!0,u.container.orbitControls.enabled=!1;let a=0;const c=new Bol3D.TWEEN.Tween(u.container.orbitCamera.position).to({x:t.position.x,y:t.position.y,z:t.position.z},n).onUpdate(()=>{}).onComplete(()=>{a++,a==2&&(u.container.orbitControls.enabled=!0,i.isAnimating=!1,e&&e())}),l=new Bol3D.TWEEN.Tween(u.container.orbitControls.target).to({x:t.target.x,y:t.target.y,z:t.target.z},n).onUpdate(()=>{}).onComplete(()=>{a++,a==2&&(u.container.orbitControls.enabled=!0,i.isAnimating=!1,e&&e())});c.delay(o).start(),l.delay(o).start()}function G(){const t=new dat.GUI,e=t.addFolder("场景");e.add(u.container.renderer,"toneMappingExposure",0,10).step(.001).name("exposure"),e.add(u.container.ambientLight,"intensity").step(.1).min(0).max(10).name("环境光强度"),e.add(u.container.gammaPass,"enabled").name("gamma校正");const o={color1:`#${i.sceneList.tube.children[0].material.color.getHexString()}`,color2:`#${i.sceneList.tube.children[16].material.color.getHexString()}`};e.addColor(o,"color1").onChange(r=>{for(let a=0;a<3;a++)i.sceneList.tube.children[a].material.color.set(r)}).name("管线颜色"),e.addColor(o,"color2").onChange(r=>{for(let a=3;a<34;a++)i.sceneList.tube.children[a].material.color.set(r)}).name("管线颜色");const n=t.addFolder("滤镜"),s={hue:0,saturation:1,vibrance:0,brightness:0,contrast:1};n.add(u.container.filterPass,"enabled"),n.add(s,"hue").min(0).max(1).step(.01).onChange(r=>{u.container.filterPass.filterMaterial.uniforms.hue.value=r}),n.add(s,"saturation").min(0).max(1).step(.01).onChange(r=>{u.container.filterPass.filterMaterial.uniforms.saturation.value=r}),n.add(s,"vibrance").min(0).max(10).step(.01).onChange(r=>{u.container.filterPass.filterMaterial.uniforms.vibrance.value=r}),n.add(s,"brightness").min(0).max(1).step(.01).onChange(r=>{u.container.filterPass.filterMaterial.uniforms.brightness.value=r}),n.add(s,"contrast").min(0).max(1).step(.01).onChange(r=>{u.container.filterPass.filterMaterial.uniforms.contrast.value=r})}function $(){const t=new Bol3D.PlaneGeometry(2e4,2e4),e=u.container.sceneList.floor.material.clone(),o=new Bol3D.Mesh(t,e);o.rotation.x=-Math.PI/2,o.position.y=-1,u.container.attach(o),u.container.sceneList.plane=o}const C=V;function z(t=""){let e=null;t?e=()=>{i.sceneList.mainBuilding.traverse(n=>{if(n.isMesh){n.visible=!0;const s=i.floorList.find(r=>r.floor===t);s&&!s.model.includes(n.name)&&(n.material.opacity=0,n.material.transparent=!0),new Bol3D.TWEEN.Tween(n.material).to({opacity:1},500).start().onComplete(()=>{n.material.transparent=!1})}})}:e=()=>{i.sceneList.mainBuilding.traverse(n=>{n.isMesh&&(i.floorList[1].model.includes(n.name)?new Bol3D.TWEEN.Tween(n.position).to({y:n.position.y+3},500).start():i.floorList[2].model.includes(n.name)?new Bol3D.TWEEN.Tween(n.position).to({y:n.position.y+6},500).start():i.floorList[3].model.includes(n.name)?new Bol3D.TWEEN.Tween(n.position).to({y:n.position.y+9},500).start():i.floorList[4].model.includes(n.name)&&new Bol3D.TWEEN.Tween(n.position).to({y:n.position.y+12},500).start())})},g({cameraState:{position:{x:-55.08483765224679,y:32.670608008474204,z:-3.13171},target:{x:-55.265641587822714,y:20,z:-39.637159}},callback:e})}function M(t,e=800){const o=i.floorList.find(r=>r.floor===t);if(i.sceneList.mainBuilding.traverse(r=>{r.isMesh&&!o.model.includes(r.name)?r.visible=!1:r.visible=!0}),g({cameraState:{position:{x:-56.14742099558634,y:40.95011072324698,z:-33.5855},target:{x:-56.12479392225676,y:20,z:-48.3605}},duration:e}),i.sceneList.peilou.visible=!0,i.sceneList.peilouLine.visible=!0,i.sceneList.school.visible=!0,i.sceneList.road.visible=!0,i.sceneList.tree.visible=!0,i.sceneList.flyLine.visible=!0,i.sceneList.carLine.visible=!0,["309","310","311","312","316","317","318","319"].forEach(r=>{const a=i.sceneList[r];a&&(a.visible=!1)}),h(),o.floor==="3f")for(let r=0;r<i.classRoomPopup.length;r++){const a=new Bol3D.POI.Popup({position:i.classRoomPopup[r].position,value:`<p style="margin:0;color: #ffffff;line-height:30px;text-align:center">${i.classRoomPopup[r].name}</p>`,className:"",style:"background: rgba(1, 19, 67, 0.8);border: 2px solid #00a1ff;border-radius: 8px;width: 80px;height: 30px;pointer-events: all;cursor: pointer",closeVisible:"hidden"});a.element.addEventListener("dblclick",()=>{k(i.classRoomPopup[r].name),i.currentScene=i.classRoomPopup[r].name}),container.attach(a),i.popupList.push(a)}}function h(t){i.popupList.forEach(e=>{t?e.name===t&&u.container.remove(e):u.container.remove(e)})}function k(t){new Bol3D.TWEEN.Tween(u.container.ambientLight).to({intensity:5},500).start(),h(),i.sceneList.mainBuilding.visible=!1;const e=i.sceneList[t];e.visible=!0;const o=i.classRoomInfo.find(n=>n.name==t).model.enterState;u.container.orbitCamera.position.set(o.position.x,o.position.y,o.position.z),u.container.orbitControls.target.set(o.target.x,o.target.y,o.target.z),A.hiddenRoof(t),i.sceneList.peilou.visible=!1,i.sceneList.peilouLine.visible=!1,i.sceneList.school.visible=!1,i.sceneList.road.visible=!1,i.sceneList.tree.visible=!1,i.sceneList.flyLine.visible=!1,i.sceneList.carLine.visible=!1,S.push("/SmartEducationInner?id="+t)}function q(){w.show(),i.outLineObjects=[],i.sceneList.mainBuilding.traverse(e=>{e.isMesh&&(i.floorList[1].model.includes(e.name)?new Bol3D.TWEEN.Tween(e.position).to({y:e.position.y-3},500).start():i.floorList[2].model.includes(e.name)?new Bol3D.TWEEN.Tween(e.position).to({y:e.position.y-6},500).start():i.floorList[3].model.includes(e.name)?new Bol3D.TWEEN.Tween(e.position).to({y:e.position.y-9},500).start():i.floorList[4].model.includes(e.name)&&new Bol3D.TWEEN.Tween(e.position).to({y:e.position.y-12},500).start())});const t=i.initialState;g({cameraState:t})}function Y({path:t=[],imgUrl:e="",flowDirection:o="x",cut:n=200,speed:s=.01,radius:r=1,repeat:a=1,type:c="fly"}){const l=new Bol3D.TextureLoader().load(e),f=[];for(let m=0,b=t.length;m<b;m+=3){const D=new Bol3D.Vector3(t[m],t[m+1],t[m+2]);f.push(D)}const p=new Bol3D.CatmullRomCurve3(f,!1,"catmullrom",0);p.arcLengthDivisions=3;const y=new Bol3D.TubeGeometry(p,64,r);l.wrapS=Bol3D.RepeatWrapping,l.wrapT=Bol3D.RepeatWrapping;const d=new Bol3D.MeshBasicMaterial({alphaToCoverage:!0,map:l,transparent:!0,side:2});d.map.repeat[o]=a;const x=new Bol3D.Mesh(y,d);return x.userData={path:t,imgUrl:e,flowDirection:o,cut:n,radius:r,repeat:a,speed:s,type:c},x}const P={flyLines:[],initFlyLines(){const t=new Bol3D.Group,e=new Bol3D.Group;for(let o=0;o<i.flyLineConfig.length;o++){const n=Y(i.flyLineConfig[o]);this.flyLines.push(n),i.flyLineConfig[o].type==="fly"?t.add(n):i.flyLineConfig[o].type==="car"&&e.add(n),i.bloomList.push(n)}i.sceneList.flyLine=t,i.sceneList.carLine=e,u.container.attach(i.sceneList.flyLine),u.container.attach(i.sceneList.carLine),i.sceneList.carLine.position.y+=10},animation(){for(let t=0;t<this.flyLines.length;t++){const e=this.flyLines[t].userData.flowDirection,o=this.flyLines[t].userData.speed;this.flyLines[t].material.map.offset[e]-=o}}};function U(){window.addEventListener("mouseup",function(t){let e=0,o=null;return function(n){n.button===2&&(o||(o=setTimeout(()=>{e=0,o=null},600)),e++,e===2&&(i.currentScene==="mainBuilding"?(i.currentScene="out",q()):["1f","2f","3f","4f","roof"].includes(i.currentScene)?(h(),z(i.currentScene),i.currentScene="mainBuilding"):["309","310","311","312","316","317","318","319"].includes(i.currentScene)&&(new Bol3D.TWEEN.Tween(u.container.ambientLight).to({intensity:2.5},500).start(),i.currentScene="3f",M("3f",0),S.push("/")),e=0,clearTimeout(o),o=null))}}())}function E(t){const e=t.getWorldScale(new Bol3D.Vector3),o=t.getWorldPosition(new Bol3D.Vector3),n=t.getWorldQuaternion(new Bol3D.Quaternion);return{position:o,scale:e,quaternion:n}}const A={currentClassRoomName:"",info:{},hiddenRoof:function(t){w.show(!1);const e=i.classRoomInfo.find(o=>o.name===t);this.info=e,i.sceneList[t].traverse(o=>{o.isMesh&&(u.container.clickObjects.push(o),e.model.roof.includes(o.name)?o.visible=!1:e.model.light.includes(o.name)||e.model.wall.includes(o.name)?(o.material.transparent=!0,o.material.opacity=.5):e.model.window.includes(o.name)?(o.material.transparent=!0,o.material.opacity=.1):t=="309"&&e.model.table.includes(o.name)&&(["309jiaoshi23_1","309jiaoshi24_1"].includes(o.name)?(o.userData.rgb=.1,o.material.color.set(1447446)):(o.userData.rgb=.2,o.material.color.set(3289650))))})},curtain:function(t){i.sceneList[this.currentClassRoomName].traverse(e=>{e.isMesh&&this.info.model.curtain.includes(e.name)&&new Bol3D.TWEEN.Tween(e.scale).to({z:t?this.info.model.curtainScale[0]:this.info.model.curtainScale[1]},500).start()})},screen:function(t){i.sceneList[this.currentClassRoomName].traverse(e=>{e.isMesh&&this.info.model.screen.includes(e.name)&&(e.material.color.r=t?1:0,e.material.color.g=t?1:0,e.material.color.b=t?1:0)})},brightness:function(t){i.sceneList[this.currentClassRoomName].traverse(e=>{e.isMesh&&(this.info.model.screen.includes(e.name)||(e.userData.rgb?(e.material.color.r=t*.01*e.userData.rgb,e.material.color.g=t*.01*e.userData.rgb,e.material.color.b=t*.01*e.userData.rgb):(e.material.color.r=t*.01,e.material.color.g=t*.01,e.material.color.b=t*.01)))})},door:function(t){i.sceneList[this.currentClassRoomName].traverse(e=>{e.isMesh&&this.info.model.door.includes(e.name)&&new Bol3D.TWEEN.Tween(e.rotation).to({z:t?-Math.PI/2:0},500).start()})}},R={flowTube:null,showTube(t){const e=[{name:"floor",type:1},{name:"road",type:1},{name:"school",type:1},{name:"peilouLine",type:1},{name:"peilou",type:1},{name:"mainBuilding",type:1},{name:"carLine",type:1},{name:"schoolEdge",type:2},{name:"mainBuildingEdge",type:2},{name:"tube",type:2}];if(t){i.currentScene="tube",new Bol3D.TWEEN.Tween(i.sceneList.plane.position).to({y:-25},100).start(),g({cameraState:i.showTubeState,callback:()=>{u.container.orbitControls.maxPolarAngle=Math.PI,u.container.orbitControls.minPolarAngle=0}}),i.sceneList.schoolEdge.visible=!0,i.sceneList.mainBuildingEdge.visible=!0,i.sceneList.tube.visible=!0;for(let o=0;o<e.length;o++)i.sceneList[e[o].name].traverse(n=>{n.isMesh&&(n.material.transparent=!0,n.material.opacity=e[o].type===1?1:0,new Bol3D.TWEEN.Tween(n.material).to({opacity:e[o].type===1?0:1},500).start())})}else{new Bol3D.TWEEN.Tween(i.sceneList.plane.position).to({y:-1},500).start(),g({cameraState:i.initialState,callback:()=>{u.container.orbitControls.maxPolarAngle=1.4,u.container.orbitControls.minPolarAngle=.3}});for(let o=0;o<e.length;o++)i.sceneList[e[o].name].traverse(n=>{n.isMesh&&(n.material.transparent=!0,n.material.opacity=e[o].type===1?0:1,new Bol3D.TWEEN.Tween(n.material).to({opacity:e[o].type===1?1:0},500).start().onComplete(()=>{e[o].name==="tube"&&(i.sceneList.schoolEdge.visible=!1,i.sceneList.mainBuildingEdge.visible=!1,i.sceneList.tube.visible=!1,i.currentScene="out"),n.material.transparent=!1}))})}},animation(){if(this.flowTube)i.currentScene==="tube"&&(this.flowTube.material.map.offset.x-=.01);else{this.flowTube=i.sceneList.tube.children.find(e=>e.name==="Wcj-gd-04");const t=new Bol3D.TextureLoader().load("./assets/3d/img/tube.png");t.wrapS=Bol3D.RepeatWrapping,t.wrapT=Bol3D.RepeatWrapping,this.flowTube.material.map=t,this.flowTube.material.alphaToCoverage=!0,this.flowTube.material.transparent=!0,this.flowTube.material.side=2}}};function H(t,e=1129055){const o=new Bol3D.Group,n=new Bol3D.LineBasicMaterial({color:e});return t.traverse(s=>{if(s.isMesh){const{position:r,scale:a,quaternion:c}=E(s),l=new Bol3D.EdgesGeometry(s.geometry.clone()),f=new Bol3D.LineSegments(l,n);f.position.set(r.x,r.y,r.z),f.scale.set(a.x,a.y,a.z),f.quaternion.set(c.x,c.y,c.z,c.w),f.material.transparent=!0,f.material.opacity=.5,o.add(f)}}),o}const w={iconMoveList:[],show(t=!0){i.sceneList.icon.visible=t},initIcon(){i.sceneList.icon=new Bol3D.Group;for(let t=0;t<i.iconList.length;t++){const e=i.iconList[t];if(e.name.includes("监控")){const o=new Bol3D.POI.Icon({position:[e.position[0],e.position[1],e.position[2]],url:"./assets/3d/img/3.png",scale:[.025,.025],color:1218267,sizeAttenuation:!1});o.name=e.name,o.material.alphaToCoverage=!0,i.bloomList.push(o),i.sceneList.icon.add(o),i.outClickObjects.push(o)}else{const o=new Bol3D.POI.Icon({position:[e.position[0],e.position[1],e.position[2]],url:"./assets/3d/img/2.png",scale:[.045,.045],color:16745216,sizeAttenuation:!1});o.name=e.name,o.material.alphaToCoverage=!0,i.bloomList.push(o),i.sceneList.icon.add(o),t===0&&this.iconMoveList.push(o);const n=new Bol3D.POI.Text({position:[e.position[0],e.position[1]+7,e.position[2]],value:[e.name],color:"#ffffff",lineHeight:40,lineSpacing:0,topSpacing:5,textAlign:"center",scale:3e-4,background:"./assets/3d/img/4.png",backgroundColor:"",sizeAttenuation:!1,publicPath:"",bgScale:[1.5,2.5],bgOffset:[0,-.05]});n.name=e.name,n.renderOrder=-1,n.material.alphaToCoverage=!0,i.bloomList.push(n),i.sceneList.icon.add(n)}}container.attach(i.sceneList.icon)},animation(t){this.iconMoveList.forEach(e=>{e.position.y+=Math.sin(t*10)/10})}};function Q(t,e="监控1"){h();let o="",n="";if(t===1?o="门禁":t===2?o="监控":t===3&&(o="保卫处"),o){const s=i.popup3DData.find(r=>r.name===o);if(t===2){const r=s.value.find(a=>a.name===e);if(r){n=`<video style="width: 100%; height: 97%;" autoplay loop src="${r.videoUrl}"></video>`;const a=new Bol3D.POI.Popup3D({value:`
            <div style="
              margin:0;
              width: 14.55vw;
              height:23vh;
              padding: 4% 0 0 0;
              float: left;
              background: url('./assets/3d/img/6.png') center / 100% 100%;
              color: #ffffff;
            ">
            ${n}
            </div>
          `,position:[r.position3D.x,r.position3D.y,r.position3D.z],className:"popup3dclass bg6",scale:[.1,.1,.1],closeVisible:"visible"});a.name=r.name,u.container.attach(a),i.popupList.push(a);const c={position:{x:r.position3D.x+40,y:r.position3D.y+40,z:r.position3D.z+40},target:r.position3D};g({cameraState:c})}}else{for(let r=0;r<s.value.length;r++){t===1?(n=`<p style='margin-bottom: 1.25rem;'>${o}</p>`,n+=`<p style='margin-bottom: 1rem;'>位置：${s.value[r].position}</p>`,n+=`<p style='margin-bottom: 1rem;'>门禁状态：${s.value[r].state}</p>`,n+=`<p style='margin-bottom: 1rem;'>今日通行人数：${s.value[r].value}</p>`):t===3&&(n=`<p style='margin-bottom: 1.25rem;'>${o}</p>`,n+=`<p style='margin-bottom: 1rem;'>位置：${s.value[r].position}</p>`,n+=`<p style='margin-bottom: 1rem;'>值班人员：${s.value[r].person}</p>`);const a=new Bol3D.POI.Popup3D({value:`
            <div style="
              margin:0;
              width: 20vw;
              height:20vh;
              padding: 0 0 0 2.6vw;
              font-size: 1.25rem;
              float: left;
              background: url('./assets/3d/img/7.png') center / 100% 100%;
              color: #ffffff;
            ">
            ${n}
            </div>
          `,position:[s.value[r].position3D.x,s.value[r].position3D.y,s.value[r].position3D.z],className:"popup3dclass bg7",scale:[.08,.08,.08],closeVisible:"visible"});a.name=s.value[r].name,u.container.attach(a),i.popupList.push(a)}if(s.value.length){const r={position:{x:s.value[0].position3D.x+40,y:s.value[0].position3D.y+40,z:s.value[0].position3D.z+40},target:s.value[0].position3D};g({cameraState:r})}}setTimeout(()=>{const r=document.getElementsByClassName("popup3dclass");r.length&&(r[0].parentElement.parentElement.style.zIndex=20)},500)}}const W=()=>{const t=i.clock.getDelta(),e=i.clock.getElapsedTime();C.peilou.shaderAnimate(t),C.school.shaderAnimate(e),P.animation(),R.animation(),w.animation(e),requestAnimationFrame(W)};function J(){let t={position:"",target:""};const e=new dat.GUI,o=e.add(t,"position"),n=e.add(t,"target");container.orbitControls.addEventListener("end",()=>{const s=container.orbitCamera.position,r="{x:"+s.x+",y:"+s.y+",z:"+s.z+"}";o.setValue(r);const a=container.orbitControls.target,c="{x:"+a.x+",y:"+a.y+",z:"+a.z+"}";n.setValue(c)})}const j={loadGUI:G,initFloor:$,initMainBuilding:z,initInnerFloor:M,dbRightClick:U,getWorldState:E,edge:H,initPopup3d:Q,icon:w,tubes:R,shader:C,classRoom:A,flyLines:P,render:W,showTargetPositon:J};export{j as A,u as C};
