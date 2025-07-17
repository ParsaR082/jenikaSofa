'use client';

import React, { useState } from 'react';
import { Button } from '@/components/ui/button';

export function AdminDebug() {
  const [logs, setLogs] = useState<string[]>([]);

  const addLog = (message: string) => {
    setLogs(prev => [...prev, `[${new Date().toLocaleTimeString()}] ${message}`]);
  };

  const testAuth = async () => {
    addLog('🔧 Testing authentication...');
    
    try {
      // Check cookies
      const cookies = document.cookie;
      addLog(`Cookies: ${cookies || 'No cookies found'}`);
      
      // Test API call
      const response = await fetch('/api/admin/users', {
        method: 'GET',
        credentials: 'include', // Important: include cookies
        headers: {
          'Content-Type': 'application/json',
        }
      });
      
      addLog(`API Response Status: ${response.status}`);
      
      if (response.ok) {
        const data = await response.json();
        addLog(`✅ API working - Found ${data.users?.length || 0} users`);
      } else {
        const error = await response.text();
        addLog(`❌ API Error: ${error}`);
      }
    } catch (error) {
      addLog(`❌ Request failed: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  };

  const testUserUpdate = async () => {
    addLog('📝 Testing user update...');
    
    try {
      // First get users list
      const usersResponse = await fetch('/api/admin/users', {
        credentials: 'include'
      });
      
      if (!usersResponse.ok) {
        addLog('❌ Cannot get users list');
        return;
      }
      
      const usersData = await usersResponse.json();
      const testUser = usersData.users?.find((u: any) => u.role !== 'SUPER_ADMIN');
      
      if (!testUser) {
        addLog('❌ No test user found');
        return;
      }
      
      addLog(`Found test user: ${testUser.username}`);
      
      // Test update
      const updateResponse = await fetch(`/api/admin/users/${testUser.id}`, {
        method: 'PATCH',
        credentials: 'include',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          username: testUser.username,
          name: testUser.name,
          email: testUser.email,
          phoneNumber: testUser.phoneNumber,
          role: testUser.role,
          phoneVerified: testUser.phoneVerified,
          emailVerified: !!testUser.emailVerified
        })
      });
      
      addLog(`Update Status: ${updateResponse.status}`);
      
      if (updateResponse.ok) {
        addLog('✅ User update working');
      } else {
        const error = await updateResponse.text();
        addLog(`❌ Update failed: ${error}`);
      }
    } catch (error) {
      addLog(`❌ Update test failed: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  };

  const clearLogs = () => setLogs([]);

  return (
    <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 my-4">
      <h3 className="font-semibold text-yellow-800 mb-2">🐛 Admin Debug Panel</h3>
      
      <div className="flex gap-2 mb-4">
        <Button onClick={testAuth} size="sm" variant="outline">
          Test Auth
        </Button>
        <Button onClick={testUserUpdate} size="sm" variant="outline">
          Test User Update
        </Button>
        <Button onClick={clearLogs} size="sm" variant="destructive">
          Clear Logs
        </Button>
      </div>
      
      <div className="bg-black text-green-400 p-3 rounded font-mono text-xs max-h-64 overflow-y-auto">
        {logs.length === 0 ? (
          <div className="text-gray-500">No logs yet. Click a test button to start.</div>
        ) : (
          logs.map((log, index) => (
            <div key={index} className="mb-1">{log}</div>
          ))
        )}
      </div>
    </div>
  );
} 