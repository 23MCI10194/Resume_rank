'use client';
import { PieChart, Pie, Cell, ResponsiveContainer, Label } from 'recharts';
import { useEffect, useState } from 'react';

const COLORS = {
  primary: 'hsl(var(--primary))',
  secondary: 'hsl(var(--secondary))',
  accent: 'hsl(var(--accent))',
};

type CircularProgressProps = {
  value: number;
  label: string;
};

export default function CircularProgress({ value, label }: CircularProgressProps) {
  const [animatedValue, setAnimatedValue] = useState(0);

  useEffect(() => {
    const targetValue = value || 0;
    let frame: number;

    const animate = () => {
      setAnimatedValue((currentValue) => {
        const diff = targetValue - currentValue;
        if (Math.abs(diff) < 0.1) {
          cancelAnimationFrame(frame);
          return targetValue;
        }
        const nextValue = currentValue + diff * 0.1;
        frame = requestAnimationFrame(animate);
        return nextValue;
      });
    };
    
    frame = requestAnimationFrame(animate);

    return () => cancelAnimationFrame(frame);
  }, [value]);

  const data = [
    { name: 'Completed', value: animatedValue },
    { name: 'Remaining', value: 100 - animatedValue },
  ];
  
  const scoreColor = animatedValue >= 80 ? COLORS.accent : COLORS.primary;

  return (
    <div className="flex flex-col items-center gap-2">
      <div style={{ width: 160, height: 160 }}>
        <ResponsiveContainer>
          <PieChart>
            <Pie
              data={data}
              cx="50%"
              cy="50%"
              innerRadius={60}
              outerRadius={75}
              startAngle={90}
              endAngle={450}
              paddingAngle={0}
              dataKey="value"
              stroke="none"
            >
              <Cell key="completed" fill={scoreColor} />
              <Cell key="remaining" fill={COLORS.secondary} />
              <Label
                value={`${Math.round(animatedValue)}%`}
                position="center"
                fill="hsl(var(--foreground))"
                style={{
                  fontSize: '2.5rem',
                  fontWeight: '700',
                  fontFamily: "'Space Grotesk', sans-serif",
                }}
              />
            </Pie>
          </PieChart>
        </ResponsiveContainer>
      </div>
      <p className="font-semibold text-muted-foreground">{label}</p>
    </div>
  );
}
