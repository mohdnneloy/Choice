# Generated by Django 4.1.1 on 2022-10-12 07:43

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('system', '0005_alter_poll_created_date_alter_poll_expire_date'),
    ]

    operations = [
        migrations.AddField(
            model_name='candidate',
            name='party_name',
            field=models.CharField(default=None, max_length=100, null=True),
        ),
    ]
