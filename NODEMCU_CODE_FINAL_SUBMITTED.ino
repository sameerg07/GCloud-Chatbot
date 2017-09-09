#include "UbidotsMicroESP8266.h"
#include <Servo.h>
/*
  Team JAI- ESP8266 Code
  This Code can Control,
   2-lights 
   1-Fan
 */

#define TOKEN  "A1E-v8eYHn72rYMlAHfc1PsfOh87HFQnyB"  //Access Token For Cloud Access
#define BedRoom_Lights "59b2f9c6762542047cb3dd8b"  //Variable Token, so as to obtain data
#define BedRoom_Fan "59b2f4b07625426fe004df10"
#define Kitchen_Lights "59b2f9cf762542066ba976ca" 
#define WIFISSID "GetAWifi!" 
#define PASSWORD "idontknow" 

Ubidots client(TOKEN); //Authorise the Cloud

Servo BD_Lights,BD_Fan,KT_Lights;  //Variables to store parameters, like switch_status etc.
int BDL_status,KTL_status,BDF_status;
int BDL_last,KTL_last;
int last_speed;

//Interrupts for toggling using the External Buttons
//Interrupt for Light-1(BDL-BedRoomLight)
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
//Interrupt for Light-(KTL-Kitchen Lights)

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
//Function to actuate servos for the regulator of the fan
void UpdateFanSpeed(int Fspeed)
{
  int out=map(Fspeed,0,4,0,180);
  BD_Fan.write(out);
  delay(100);
  //client.add(BedRoom_Fan,Fspeed);
}

//Function to Read Potentiometer Value, so that, the fan can be controlled externally.
/* The Code has been logically written, 
 *  so as to take the latest change in value from the server,
    either the external, or the AI commands*/
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


//MAIN Setup Function
void setup(){
    Serial.begin(115200);
    client.wifiConnection(WIFISSID, PASSWORD);
    //CONNECT TO WIFI
    pinMode(D1,INPUT_PULLUP);  //Switch 1
    pinMode(D2,INPUT_PULLUP);  //Switch 2
    pinMode(A0,INPUT);   //POT 1 for Fan
    BD_Lights.attach(D3);  //Servo 1
    BD_Fan.attach(D4);    //Servo 2
    KT_Lights.attach(D5); //Servo 3
    attachInterrupt(digitalPinToInterrupt(D1),BDLinterrupt,FALLING);
    attachInterrupt(digitalPinToInterrupt(D2),KTLinterrupt,FALLING);
    int val=analogRead(A0);
    //Attach Interrupts for switches
    //Read Intial value, for telling the latest update
    last_speed=map(val,0,1023,0,4);
    BD_Lights.write(90);//Writing The Intial Position
    BD_Fan.write(0);  
    KT_Lights.write(90);
}
/*
 * Functions to Toggle Switch states, to 
 * either turn on or off, the servos
 * to the Particular Switch
 * ToggleBDL-->Toggle BedRoomLights
*/
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
      client.add(BedRoom_Lights, BDL_status);  //Write New Values to Cloud
    }
    if(BDL_status==0)
    {
      BDL_last=BDL_status;
      for(int i=90;i>52;i--)
      {
       BD_Lights.write(i);
       delay(15);
      }
      client.add(BedRoom_Lights, BDL_status);  //Write New Values to Cloud
    }
  }
}

/*
 * Functions to Toggle Switch states, to 
 * either turn on or off, the servos
 * to the Particular Switch
 * ToggleKTL-->Toggle KitchenLights
*/
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
      client.add(Kitchen_Lights, KTL_status);  //Write New Values to Cloud
    }
    if(KTL_status==0)
    {
      KTL_last=KTL_status;
      for(int i=90;i>52;i--)
      {
       KT_Lights.write(i);
       delay(15);
      }
      client.add(Kitchen_Lights, KTL_status);  //Write New Values to Cloud
    }
  }
}
//MAIN Loop Function.
void loop()
{
BDL_status=client.getValue(BedRoom_Lights);  //Read the Status of each variable from CLoud
KTL_status=client.getValue(Kitchen_Lights);
BDF_status=client.getValue(BedRoom_Fan);
Serial.print(BDL_status);   //Print for Refernce Purposes, No use in actual deployed Product
Serial.print(" ");
Serial.print(KTL_status);
Serial.print(" ");
Serial.println(BDF_status);
//Update the servos based on the Values received
DetectFanSpeed();
ToggleKTL();
ToggleBDL();
UpdateFanSpeed(BDF_status);
delay(100); // A small Delay
}
