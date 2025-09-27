// 在军事演习中,有一梯度伞兵A人(A>100),从空中降落到不同区域,其中区域大小为(X,Y,X+W,Y+H)。每个伞兵因体力不同行进的速度也不同，其单个闪兵速度最大是V_a。
//  司令部规定，如果闪兵相遇[即闪兵和闪兵间距小于Z<min(W,H)],伞兵落地时间早的为头兵，带领其余闪兵行进作战,且闪兵和闪兵之间间距不能靠的太近，
//  间距为{z|z>0,z<Z}。头兵行进方向可以随意[即随机方向]。如果因体力不支的闪兵即没有跟上其他任一闪兵可单独作战。请合理设值A,X,Y,W,H,Z,z,
//  V_a用任意形状的图形代替闪兵，用动画演示每秒的效果。可以直接演示头兵，或只演示一个头兵随机行动这一行为（得分较低），
//  也可以演示全部闪兵（得分较高）
// 要求：
// 1，用 Nextjs 实现上述页面。
// 2，简单部署，提交访问链接。
// 3，提供上述代码源码，提交github 地址。

"use client"
import React, { useState, useEffect, useRef } from 'react';

const Home = () => {
  
  const config = {
    A: 101,    
    W: 600,
    H: 400, 
    Z: 40,   
    z: 20,     
    V_a: 30,   
  };
  
  const [paratroopers, setParatroopers] = useState([]);
  const animationRef = useRef();

  // 初始化伞兵
  const initParatroopers = () => {
    const troops = [];
    for (let i = 0; i < config.A; i++) {
      troops.push({
        id: i,
        x: Math.random() * config.W,
        y: Math.random() * config.H,
        speed: 10 + Math.random() * config.V_a,
        direction: Math.random() * Math.PI * 2,
        color: `hsl(${Math.random() * 360}, 70%, 60%)`,
        isLeader: false,
        groupId: -1,
      });
    }
    return troops;
  };

  // 更新位置
  const updateTroops = (troops) => {
    return troops.map(trooper => {
      // 寻找附近伞兵
      const nearby = troops.filter(other => 
        other.id !== trooper.id && 
        Math.sqrt((trooper.x - other.x) ** 2 + (trooper.y - other.y) ** 2) < config.Z
      );

      // 如果有附近伞兵且还没有队伍，成为头兵
      if (nearby.length > 0 && trooper.groupId === -1) {
        trooper.isLeader = true;
        trooper.groupId = trooper.id;
      }

      // 头兵随机移动
      if (trooper.isLeader) {
        trooper.direction += (Math.random() - 0.5) * 0.3;
      }

      // 移动
      let newX = trooper.x + Math.cos(trooper.direction) * trooper.speed * 0.02;
      let newY = trooper.y + Math.sin(trooper.direction) * trooper.speed * 0.02;

      // 边界反弹
      if (newX < 0 || newX > config.W) trooper.direction = Math.PI - trooper.direction;
      if (newY < 0 || newY > config.H) trooper.direction = -trooper.direction;

      trooper.x = Math.max(0, Math.min(config.W, newX));
      trooper.y = Math.max(0, Math.min(config.H, newY));

      return trooper;
    });
  };

  // 动画循环
  const animate = () => {
    setParatroopers(prev => updateTroops([...prev]));
    animationRef.current = requestAnimationFrame(animate);
  };

  useEffect(() => {
    setParatroopers(initParatroopers());
    animationRef.current = requestAnimationFrame(animate);
    return () => cancelAnimationFrame(animationRef.current);
  }, []);

  return (
    <div style={{ padding: '20px' }}>
      <svg width={config.W} height={config.H} style={{ border: '1px solid #ccc' }}>
        {paratroopers.map(trooper => (
          <circle
            key={trooper.id}
            cx={trooper.x}
            cy={trooper.y}
            r={trooper.isLeader ? 6 : 4}
            fill={trooper.color}
            stroke={trooper.isLeader ? '#FFD700' : '#fff'}
            strokeWidth={trooper.isLeader ? 2 : 1}
          />
        ))}
      </svg>
    </div>
  );
};

export default Home;