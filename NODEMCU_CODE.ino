#include "UbidotsMicroESP8266.h"
#include <Servo.h>

#define TOKEN  "A1E-v8eYHn72rYMlAHfc1PsfOh87HFQnyB"  
#define BedRoom_Lights "59b2f9c6762542047cb3dd8b"
#define BedRoom_Fan "59b2f4b07625426fe004df10"
#define Kitchen_Lights "59b2f9cf762542066ba976ca" 
#define WIFISSID "GetAWifi!" 
#define PASSWORD "idontknow" 

Ubidots client(TOKEN);
Servo BD_Lights,BD_Fan,KT_Lights;
int BDL_status,KTL_status,BDF_status;
int BDL_last,KTL_last;
int last_speed;

void BDLinterrupt()
{
  if (BDL_status==1)
   { BDL_status=0;
   client.add(BedRoom_Lights, BDL_status);
   }else
    {BDL_status=1;
    Serial.println("IT");
    client.add(BedRoom_Lights, BDL_status);
    }
}

void KTLinterrupt()
{
 if (KTL_status==1)
    {KTL_status=0;
    client.add(Kitchen_Lights, KTL_status);
    }
 else
 {
    KTL_status=1;
    client.add(Kitchen_Lights, KTL_status);
 }
}

void UpdateFanSpeed(int Fspeed)
{
  int out=map(Fspeed,0,4,0,180);
  BD_Fan.write(out);
  delay(100);
  //client.add(BedRoom_Fan,Fspeed);
}

void DetectFanSpeed()
{

  int val=analogRead(A0);
  BDF_status=map(val,0,1023,0,4);
  if(BDF_status!=last_speed)
  {
    UpdateFanSpeed(BDF_status);
    last_speed=BDF_status;
    Serial.println("FC");
  }
}



void setup(){
    Serial.begin(115200);
    client.wifiConnection(WIFISSID, PASSWORD);
    
    pinMode(D1,INPUT_PULLUP);
    pinMode(D2,INPUT_PULLUP);
    pinMode(A0,INPUT);
    BD_Lights.attach(D3);
    BD_Fan.attach(D4);
    KT_Lights.attach(D5);
    attachInterrupt(digitalPinToInterrupt(D1),BDLinterrupt,FALLING);
    attachInterrupt(digitalPinToInterrupt(D2),KTLinterrupt,FALLING);
    int val=analogRead(A0);
    last_speed=map(val,0,1023,0,4);
    BD_Lights.write(90);
    BD_Fan.write(0);
    KT_Lights.write(90);
}

void ToggleBDL()
{
  if (BDL_last!=BDL_status)
  {
    if(BDL_status==1)
    {
      BDL_last=BDL_status;
      for(int i=90;i<130;i++)
      {
       BD_Lights.write(i);
       delay(15);
      }
      client.add(BedRoom_Lights, BDL_status);
    }
    if(BDL_status==0)
    {
      BDL_last=BDL_status;
      for(int i=90;i>52;i--)
      {
       BD_Lights.write(i);
       delay(15);
      }
      client.add(BedRoom_Lights, BDL_status);
    }
  }
}

void ToggleKTL()
{
  if (KTL_last!=KTL_status)
  {
    if(KTL_status==1)
    {
      KTL_last=KTL_status;
      for(int i=90;i<130;i++)
      {
       KT_Lights.write(i);
       delay(15);
      }
      client.add(Kitchen_Lights, KTL_status);
    }
    if(KTL_status==0)
    {
      KTL_last=KTL_status;
      for(int i=90;i>52;i--)
      {
       KT_Lights.write(i);
       delay(15);
      }
      client.add(Kitchen_Lights, KTL_status);
    }
  }
}

void loop()
{
BDL_status=client.getValue(BedRoom_Lights);
KTL_status=client.getValue(Kitchen_Lights);
BDF_status=client.getValue(BedRoom_Fan);
Serial.print(BDL_status);
Serial.print(" ");
Serial.print(KTL_status);
Serial.print(" ");
Serial.println(BDF_status);
//DetectFanSpeed();
ToggleKTL();
ToggleBDL();
UpdateFanSpeed(BDF_status);
delay(500);
}
